import { Injectable } from '@angular/core';
import { Resource } from '../../model/resource';
import { Locale } from '../../model/locale';
import { Translation } from '../../model/translation';
import { Project } from '../../model/project';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';


let resources: Resource[] = [
  {
    id: "201520",
    value: "La cuenta no existe",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta no existe'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion no existe'
      }
    ]
  },
  {
    id: "201521",
    value: "La cuenta esta bloqueada",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta esta bloqueada'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion esta bloqueada'
      }
    ]
  },
  {
    id: "201522",
    value: "La cuenta no tiene saldo",
    translations: [
      {
        locale: 'ES-EC',
        value: 'La cuenta no tiene saldo'
      },
      {
        locale: 'ES-PA',
        value: 'La operacion no tiene saldo'
      }
    ]
  }
];

let project: Project = {
  name: 'Project 1',
  description: 'Project 1 description',
  baseLocale: 'ES-EC',
  locales: [
    { id: 'ES-EC', name: 'Español Ecuador' },
    { id: 'ES-PA', name: 'Español Panamá' }
  ]
}


let allLocales = [
  { id: 'ES-EC', name: 'Español Ecuador' },
  { id: 'ES-PA', name: 'Español Panamá' },
  { id: 'EN-US', name: 'English US' },
  { id: 'EN-GB', name: 'English UK' },
  { id: 'FR-FR', name: 'French France' },
  { id: 'FR-CA', name: 'French Canada' },
  { id: 'DE-DE', name: 'German Germany' },
  { id: 'ES-CO', name: 'Español Colombia' },
]

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;
  constructor() {

    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');

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


  getResources(): Resource[] {
    return resources;
  }

  addResource(resource: Resource): void {
    let found = resources.some((r: Resource) => r.id == resource.id);
    if (found) {
      throw new Error('Resource already exists');
    }
    resource.translations = [];
    project.locales.forEach((locale: Locale) => {
      resource.translations.push({
        locale: locale.id,
        value: resource.value
      });
    });
    resources.push(resource); // add resource to the end of the array

    if (this.isElectron) {
      this.fs.writeFileSync('resources-2.json',
        JSON.stringify(resources, null, 4),
        'utf8');
    }
  }

  updateResource(resource: Resource): void {
    let index = resources.findIndex((r: Resource) => r.id == resource.id);
    resources[index] = resource; // replace resource at index
  }

  deleteResource(resourceId: string): void {
    let index = resources.findIndex((r: Resource) => r.id == resourceId);
    resources.splice(index, 1); // remove 1 element from index
  }

  updateTranslation(
    resourceId: string,
    translation: Translation): void {
    let resource = resources.find((r: Resource) => r.id == resourceId);
    if (!resource) return;
    let index = resource.translations.findIndex((t: any) => t.locale == translation.locale);
    resource.translations[index] = translation;
    if (this.isElectron) {
      this.fs.writeFileSync('resources-2.json',
        JSON.stringify(resources, null, 4),
        'utf8');
    }
  }

  addLocaleToAllResources(locale: Locale): void {

    resources.forEach((resource: Resource) => {
      let baseTranslation = resource.translations.find((t: Translation) => t.locale == project.baseLocale);
      resource.translations.push({ locale: locale.id, value: baseTranslation?.value || '' });
    });
    project.locales.push(locale);
  }

  removeLocaleFromAllResources(locale: Locale): void {
    resources.forEach((resource: Resource) => {
      let index = resource.translations.findIndex((t: Translation) => t.locale == locale.id);
      resource.translations.splice(index, 1);
    });
    let index = project.locales.findIndex((l: Locale) => l.id == locale.id);
    project.locales.splice(index, 1);
  }

  getLocales(): Locale[] {
    return project.locales;
  }

  getAllLocales(): Locale[] {
    return allLocales;
  }

  getBaseLocale(): Locale | undefined {
    return project.locales.find((locale: Locale) => locale.id == project.baseLocale);
  }

  getProject(): Project {
    return project;
  }

  updateProject(project: Project): void {
    project = project;
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

}
