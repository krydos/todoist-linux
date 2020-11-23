const { app, Tray, Menu } = require("electron");
const shell = require("electron").shell;
const path = require("path");

const { ShortcutConfig } = require("./shortcutConfig");

function createTray(config, win) {
    const configInstance = new ShortcutConfig();

    // if tray-icon is set to null in config file then don't create a tray icon
    if (!config["tray-icon"]) return;

    let tray = new Tray(path.join(__dirname, `icons/${config["tray-icon"]}`));
    let contextMenu = Menu.buildFromTemplate([
        {
            label: "Open Todoist",
            click: function () {
                win.show();
            },
            id: "show-win",
        },
        {
            type: "separator",
        },
        {
            label: "Add task",
            click: function () {
                win.webContents.sendInputEvent({
                    type: "keyDown",
                    keyCode: "Escape",
                });
                win.webContents.sendInputEvent({
                    type: "keyUp",
                    keyCode: "Escape",
                });
                win.webContents.sendInputEvent({
                    type: "char",
                    keyCode: "q",
                });
                win.show();
                win.webContents.send("focus-quick-add");
            },
            id: "add-task",
        },
        {
            label: "Search",
            click: function () {
                win.webContents.sendInputEvent({
                    type: "keyDown",
                    keyCode: "Escape",
                });
                win.webContents.sendInputEvent({
                    type: "keyUp",
                    keyCode: "Escape",
                });
                win.webContents.sendInputEvent({
                    type: "char",
                    keyCode: "f",
                });
                win.show();
            },
            id: "search",
        },
        {
            label: "Inbox",
            click: function () {
                win.show();
                win.webContents.send("go-to-anchor", "filter_inbox");
            },
            id: "inbox",
        },
        {
            label: "Today",
            click: function () {
                win.show();
                win.webContents.send("go-to-anchor", "filter_today");
            },
            id: "today",
        },
        {
            label: "Upcoming",
            click: function () {
                win.show();
                win.webContents.send("go-to-anchor", "filter_upcoming");
            },
            id: "upcoming",
        },
        {
            type: "separator",
        },
        {
            label: "Preferences",
            click: function () {
                shell.openItem(configInstance.getConfigFilename());
            },
            id: "preferences",
        },
        {
            label: "Report an issue",
            click: function () {
                shell.openExternal(
                    "https://github.com/KryDos/todoist-linux/issues/new"
                );
            },
            id: "report-issue",
        },
        {
            type: "separator",
        },
        {
            label: "Quit Todoist",
            click: function () {
                app.forceQuit = true;
                app.quit();
            },
            id: "quit",
        },
    ]);
    tray.setToolTip("Todoist");
    tray.setContextMenu(contextMenu);
}

module.exports = createTray;
