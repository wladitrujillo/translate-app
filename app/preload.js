"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererApi = void 0;
const electron_1 = require("electron");
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
    var _a;
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };
    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, (_a = process.versions[type]) !== null && _a !== void 0 ? _a : "unknown");
    }
});
// The API relays method calls to the main process using `ipcRenderer` methods.
// It does not provide direct access to `ipcRenderer` or other Electron or Node APIs.
exports.RendererApi = {
    sayHello: (name) => {
        electron_1.ipcRenderer.send("sayHello", name);
    },
    getAppMetrics: () => {
        return electron_1.ipcRenderer.invoke("getAppMetrics");
    },
    openDialog: (config) => {
        electron_1.ipcRenderer.invoke('showOpenDialog', config);
    }
};
// SECURITY: expose a limted API to the renderer over the context bridge
// https://github.com/1password/electron-secure-defaults/SECURITY.md#rule-3
electron_1.contextBridge.exposeInMainWorld("api", exports.RendererApi);
//# sourceMappingURL=preload.js.map