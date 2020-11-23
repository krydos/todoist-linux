const { app, BrowserWindow, Menu } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const url = require("url");

const { ShortcutConfig } = require("./shortcutConfig");
const createTray = require("./tray");
const createMenuBar = require("./menuBar");
const shortcuts = require("./shortcuts");
const util = require("./util");

let win = {};
let config = {};

function createWindow() {
    util.setCustomUserAgent();

    const configInstance = new ShortcutConfig();
    config = configInstance.config;

    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600,
    });

    // use mainWindowState to restore previous
    // size/position of window
    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minHeight: 600,
        minWidth: 450,
        title: "Todoist",
        icon: path.join(__dirname, "icons/icon.png"),
        autoHideMenuBar: true,
        show: !(config["start-minimized"] === true),
    });

    win.webContents.setVisualZoomLevelLimits(1, 5);
    Menu.setApplicationMenu(createMenuBar(config, win));

    // and load the index.html of the app.
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        })
    );

    shortcutsInstance = new shortcuts(win, app);
    shortcutsInstance.registerAllShortcuts();

    // Only send to tray on minimize if user is running with tray and minimizing to tray is allowed
    win.on("minimize", function (event) {
        if (config["tray-icon"] && config["minimize-to-tray"]) {
            event.preventDefault();
            win.hide();
        }
    });

    win.on("close", function (event) {
        if (app.forceQuit || !config["tray-icon"] || !config["close-to-tray"]) {
            // Do the default electron behaviour which is to close the main window
            // In production build the app is not closed probably due to this bug - https://github.com/electron/electron/issues/10156
            // call the app.quit() once again, it helps
            app.forceQuit = true;
            app.quit();
            return;
        }

        event.preventDefault();
        win.hide();
    });

    // manage size/position of the window
    // so it can be restored next time
    mainWindowState.manage(win);
}

var gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) {
                win.restore();
                win.focus();
            }
            win.show();
            win.focus();
        }
    });
}

app.on("ready", () => {
    createWindow();
    createTray(config, win);

    win.webContents.on("dom-ready", () => {
        if (config["beta"]) {
            win.webContents.send("is-beta");
        }
    });
});
