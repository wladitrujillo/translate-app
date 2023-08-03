import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Resource } from '../../model/resource';
import { Project } from '../../model/project';

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

  projectPath: string = "";


  constructor() {

    this.projectPath = "C:\\Users\\wladi\\Documents\\electron-files";

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
      this.fs.writeFile(`${this.projectPath}\\${RESOURCES}`,
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        },
        (err) => {
          if (err) console.error(err);
        });
    }
  }
  
  getResourcesFromDisk = () => {
    if (this.isElectron) {
      let data = this.fs.readFileSync(`${this.projectPath}\\${RESOURCES}`, 'utf8');
      return JSON.parse(data);
    }
    return [];
  }


  saveProjectToDisk = (data: Project) => {
    if (this.isElectron) {
      this.fs.writeFile(`${this.projectPath}\\${PROJECT}`,
        JSON.stringify(data, null, 4),
        {
          encoding: "utf8",
          flag: "w",
          mode: 0o666
        },
        (err) => {
          if (err) console.error(err);
        });
    }
  }

  getProjectFromDisk = () => {
    if (this.isElectron) {
      let data = this.fs.readFileSync(`${this.projectPath}\\${PROJECT}`, 'utf8');
      return JSON.parse(data);
    }
    return [];
  }


  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

}
