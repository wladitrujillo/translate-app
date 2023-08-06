import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

import { Resource } from '../../model/resource';
import { Project } from '../../model/project';
import { BehaviorSubject, Observable, of } from 'rxjs';

const RESOURCES: string = "resources.json";
const PROJECT: string = "project.json";
@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;

  subject = new BehaviorSubject<string>('');

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

  /*saveResourceToDisk = (url: string, filePath: string) => {
    return new Promise((resolve, reject) => {
      this.ipcRenderer.invoke('saveResourceToDisk', url, filePath).then((result: any) => {
        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }*/


  saveResourcesToDisk = (data: Resource[]) => {
    if (this.isElectron) {
      this.fs.writeFileSync(`${this.appDataPath}\\${RESOURCES}`,
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        });
    }
  }

  getResourcesFromDisk = () => {

    if (!this.basePath) return [];

    if (this.isElectron) {
      let data = this.fs.readFileSync(`${this.appDataPath}\\${RESOURCES}`, 'utf8');
      return JSON.parse(data);
    }
    return [];
  }


  saveProjectToDisk = (data: Project) => {
    if (!this.basePath) return;
    if (this.isElectron) {
      this.fs.writeFileSync(`${this.basePath}\\${PROJECT}`,
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        });
    }
  }

  createFolder = (path: string) => {

    if (this.isElectron) {
      if (this.fs.existsSync(path)) {
        return;
      }
      this.fs.mkdirSync(path, { recursive: true });
    }

  }

  getProjectFromDisk = () => {
    if (!this.basePath) return {};
    if (this.isElectron) {
      let data = this.fs.readFileSync(`${this.basePath}\\${PROJECT}`, 'utf8');
      return JSON.parse(data);
    }
    return {};
  }

  showOpenDialog = (): Observable<string> => {
    if (this.isElectron) {
      const promise = this.ipcRenderer.invoke('showOpenDialog', {
        title: 'Select a file',
        buttonLabel: 'Abrir',
        filters: [
          { name: 'Archivos', extensions: ['json'] },
        ],
        properties: ['openFile']
      });
      promise
        .then((result: any) => {
          console.log(result);
          if (result.canceled) {
            this.subject.error('No se seleccionó ningún archivo');
            localStorage.removeItem('path');
          } else {
            //TO-DO: Validar que sea un archivo json and that contains the correct structure
            const path = result.filePaths[0].split('\\').slice(0, -1).join('\\');
            localStorage.setItem('path', path);
            this.subject.next(result.filePaths[0]);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.subject.error(error);
        });
    }
    return this.subject;
  }

  showOpenDialogDirectory = (): Observable<string> => {
    if (this.isElectron) {
      const promise = this.ipcRenderer.invoke('showOpenDialog', {
        title: 'Selccione una carpeta',
        buttonLabel: 'Seleccionar carpeta',
        properties: ['openDirectory']
      });
      promise
        .then((result: any) => {
          console.log(result);
          if (result.canceled) {
            this.subject.error('No se seleccionó ninguna carpeta');
            localStorage.removeItem('path');
          } else {
            this.subject.next(result.filePaths[0]);
            localStorage.setItem('path', result.filePaths[0]);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.subject.error(error);
        });
    }
    return this.subject;
  }


  get appDataPath(): string {
    return this.basePath + '\\AppData';
  }

  get basePath(): string {
    return localStorage.getItem('path') || '';
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }



}
