// Pack Opener — application de bureau
// Ouvre le jeu dans une fenêtre et vérifie les mises à jour publiées sur GitHub.
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 860,
    minWidth: 420,
    minHeight: 640,
    backgroundColor: "#0b0a18",
    title: "Pack Opener",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, "app", "index.html"));
  // Les liens externes s'ouvrent dans le navigateur, pas dans le jeu.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Dernier état connu, renvoyé au jeu s'il n'était pas encore chargé au moment de l'événement.
let lastState = null;
function send(state) {
  lastState = state;
  if (win && !win.isDestroyed()) win.webContents.send("ldm:update", state);
}

function setupUpdates() {
  log.transports.file.level = "info";
  autoUpdater.logger = log;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on("update-available", (i) => send({ state: "available", version: i.version }));
  autoUpdater.on("download-progress", (p) => send({ state: "progress", percent: Math.round(p.percent) }));
  autoUpdater.on("update-downloaded", (i) => send({ state: "ready", version: i.version }));
  autoUpdater.on("error", (e) => { log.error(e); send({ state: "error" }); });
  // Vérifie au lancement, toutes les 15 minutes, et quand on revient sur la fenêtre.
  let lastCheck = 0;
  const check = () => {
    if (lastState && (lastState.state === "progress" || lastState.state === "ready")) return;
    lastCheck = Date.now();
    autoUpdater.checkForUpdates().catch((e) => log.error(e));
  };
  check();
  setInterval(check, 15 * 60 * 1000);
  app.on("browser-window-focus", () => { if (Date.now() - lastCheck > 5 * 60 * 1000) check(); });
}

ipcMain.handle("ldm:version", () => app.getVersion());
ipcMain.handle("ldm:state", () => lastState);
ipcMain.on("ldm:install", () => autoUpdater.quitAndInstall());

// Une seule fenêtre du jeu à la fois.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    createWindow();
    if (app.isPackaged) setupUpdates();
  });
  app.on("window-all-closed", () => app.quit());
}
