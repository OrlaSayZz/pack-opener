// Pont minimal et sûr entre le jeu et l'application.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ldm", {
  version: () => ipcRenderer.invoke("ldm:version"),
  onUpdate: (fn) => ipcRenderer.on("ldm:update", (_e, state) => fn(state)),
  installUpdate: () => ipcRenderer.send("ldm:install"),
});
