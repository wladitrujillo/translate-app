import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'sql-formatter';

import { Locale } from '@core/model/locale';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  path!: typeof path;
  format!: typeof format;

  constructor() {

    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');
      this.format = (window as any).require('sql-formatter');
      this.childProcess = (window as any).require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  private toMySql(resource: any, locale: string, baseLocale: string): string {

    let baseTranslation = resource
      .translations
      .find((translation: any) => translation.locale == baseLocale);

    let translation = resource
      .translations
      .find((translation: any) => translation.locale == locale);


    if (!translation || !baseTranslation) {
      return '';
    }

    let result = '';

    if (baseTranslation.locale == translation.locale || baseTranslation.value != translation.value) {
      result =
        `select @pc_id := pc_id 
    from cobis.ad_pseudo_catalogo
    where pc_codigo_int = ${resource.id};`;

      result +=
        `update cobis.ad_recurso 
        set re_valor = '${translation.value}'
        where re_pc_id = @pc_id
        and re_cultura = '${translation.locale}';`;
    }

    return result;
  }


  private getScriptMySqlForLocales(procedureName: string, locale: string, baseLocale: string): string {
    let header = 'use cobis;\n';
    header += `DROP PROCEDURE IF EXISTS ${procedureName};\n`;
    header += 'DELIMITER //\n';
    header += `CREATE PROCEDURE ${procedureName}()\n`;
    header += 'BEGIN\n';

    const resources = JSON.parse(this.fs.readFileSync(`${this.appDataPath}\\resources.json`, 'utf8'));
    let body = '';
    resources.forEach((resource: any) => {
      body += this.toMySql(resource, locale, baseLocale);
    });

    body = format(body,
      {
        language: 'mysql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 1,
      });

    let footer = `\nEND//\n`;
    footer += `DELIMITER ;\n`;
    footer += `CALL ${procedureName}();\n`;
    footer += `DROP PROCEDURE IF EXISTS ${procedureName};\n`;

    return header + body + footer;
  }

  exportToMySql(locales: Locale[], baseLocale: Locale): void {

    for (let locale of locales) {

      let sql = this.getScriptMySqlForLocales(`COBIS_mysql_${locale.id}`,
        locale.id, baseLocale.id);

      if (this.isElectron) {
        this.createBuildFolder();
        const filePath = `${this.appBuildPath}\\COBIS_mysql_${locale.id}.sql`;
        if (this.fs.existsSync(filePath)) {
          this.fs.unlinkSync(filePath);
        }
        this.fs.appendFileSync(filePath, sql);
      }

    }


  };

  exportToSqlServer(locales: Locale[], baseLocale: Locale): void {
    for (let locale of locales) {
      let sql = this.getScriptMySqlForLocales(`COBIS_sqlserver_${locale.id}`,
        locale.id, baseLocale.id);

      if (this.isElectron) {
        this.createBuildFolder();
        const pathToResult = `${this.appBuildPath}\\COBIS_sqlserver_${locale.id}.sql`;
        this.fs.appendFileSync(pathToResult, sql);
      }
    }
  };

  exportToJson(locales: Locale[]): void {

    const resources = JSON.parse(this.fs.readFileSync(`${this.appDataPath}\\resources.json`, 'utf8'));

    for (let locale of locales) {
      let json: any = {};
      for (let resource of resources) {
        json[resource.id] = resource.translations.find((translation: any) => translation.locale === locale.id)?.value;
      }
      if (this.isElectron) {
        this.createBuildFolder();
        const pathToResult = `${this.appBuildPath}\\${locale.id}.json`;
        this.fs.appendFileSync(pathToResult, JSON.stringify(json, null, 4));
      }
    }


  }

  get appBuildPath(): string {
    return localStorage.getItem('path') + '\\build';
  }

  get appDataPath(): string {
    return localStorage.getItem('path') + '\\AppData';
  }

  private createBuildFolder(): void {
    const path = this.appBuildPath;
    if (!this.fs.existsSync(path)) {
      this.fs.mkdirSync(path);
    }
  }


  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }


}
