const { app, Menu } = require("electron");
const shell = require("electron").shell;
const path = require("path");

const { ShortcutConfig } = require("./shortcutConfig");

function createMenuBar(config) {
  const configInstance = new ShortcutConfig();

  return Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Preferences",
          click: function () {
            shell.openItem(
              path.join(
                configInstance.getConfigDirectory(),
                ".todoist-linux.json"
              )
            );
          },
        },
        {
          label: "Quit",
          click: function () {
            app.forceQuit = true;
            app.quit();
          },
          accelerator: config["quit"],
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Actual Size",
          role: "resetzoom",
          accelerator: "CommandOrControl+0",
        },
        {
          label: "Zoom In",
          role: "zoomin",
          accelerator: "CommandOrControl+=",
        },
        {
          label: "Zoom Out",
          role: "zoomout",
          accelerator: "CommandOrControl+-",
        },
        {
          type: "separator",
        },
        {
          label: "Show/Hide",
          click: function () {
            win.hide();
          },
          accelerator: config["show-hide"],
        },
        {
          label: "Refresh",
          click: function () {
            win.reload();
          },
          accelerator: config["refresh"],
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "GitHub",
          click: function () {
            shell.openExternal("https://github.com/KryDos/todoist-linux");
          },
        },
        {
          label: "Changelog",
          click: function () {
            shell.openExternal(
              "https://github.com/krydos/todoist-linux/releases"
            );
          },
        },
        {
          label: "Report an issue",
          click: function () {
            shell.openExternal(
              "https://github.com/KryDos/todoist-linux/issues/new"
            );
          },
        },
      ],
    },
  ]);
}

module.exports = createMenuBar;
