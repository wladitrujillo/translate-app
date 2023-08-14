import { contextBridge, ipcRenderer } from "electron";
import { ProjectSrv } from "./services/project.srv"
import { ResourceSrv } from "./services/resource.srv";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(
            `${type}-version`,
            process.versions[type as keyof NodeJS.ProcessVersions] ?? "unknown"
        );
    }
});

// The API relays method calls to the main process using `ipcRenderer` methods.
// It does not provide direct access to `ipcRenderer` or other Electron or Node APIs.
export const RendererApi = {
    sayHello: (name: string): void => {
        ipcRenderer.send("sayHello", name);
    },

    getAppMetrics: (): Promise<Electron.ProcessMetric[]> => {
        return ipcRenderer.invoke("getAppMetrics");
    },

    showOpenDialog: (config: any): Promise<string> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke('showOpenDialog', config)
                .then((result: any) => {
                    resolve(result);
                }).catch((error: any) => {
                    reject(error);
                });
        });
    }
};

// SECURITY: expose a limted API to the renderer over the context bridge
// https://github.com/1password/electron-secure-defaults/SECURITY.md#rule-3
contextBridge.exposeInMainWorld("api", RendererApi);
contextBridge.exposeInMainWorld("projectApi", new ProjectSrv(new ResourceSrv()));