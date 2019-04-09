const {
  app,
  BrowserWindow,
  Tray,
  Menu,
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const shell = require('electron').shell;
const path = require('path');
const url = require('url');

const shortcuts = require('./shortcuts');

let win = {};
let gOauthWindow = undefined;
let tray = null;
let contextMenu;

function handleRedirect(e, url) {
    // there may be some popups on the same page
    if(url == win.webContents.getURL()) {
        return true;
    }

    // when user is logged in there is link
    // asks to update the page. It should be opened
    // in the app and not in the external browser
    if (/https:\/\/todoist\.com\/app/.test(url)) {
        win.reload();
        return true;
    }

    /**
     * In case of google's oauth login
     * let's create another window and listen for
     * its "close" event.
     * As soon as that event fired we can refresh our
     * main window.
     */
    if (/google.+?oauth/.test(url)) {
        e.preventDefault();
        gOauthWindow = new BrowserWindow();
        gOauthWindow.loadURL(url);
        gOauthWindow.on('close', () => {
            win.reload();
        })
        return true;
    }

    e.preventDefault()
    shell.openExternal(url)
}

function createTray(win) {
    tray = new Tray(path.join(__dirname, 'icons/icon.png'));
    contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show', click:  function() {
          win.show();
        },
        enabled: false,
        id: 'show-win'
      },
      {
        label: 'Hide', click:  function() {
          win.hide();
        },
        id: 'hide-win'
      },
      {
        label: 'Toggle FullScreen', click:  function() {
          win.setFullScreen(!win.isFullScreen());
        }
      },
      {
        label: 'Quit', click:  function() {
          app.isQuiting = true;
          app.quit();
        }
      }
    ]);
    tray.setToolTip('Todoist');
    tray.setContextMenu(contextMenu);
}

function createWindow () {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600
    });

    // use mainWindowState to restore previous
    // size/position of window
    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        title: 'Todoist',
        icon: path.join(__dirname, 'icons/icon.png')
    });


    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win['currentWindowState'] = 'shown';

    createTray(win);
    win.setMenu(null);
    shortcutsInstance = new shortcuts(win, app);
    shortcutsInstance.registerAllShortcuts();

    // react on close and minimzie
    win.on('minimize',function(event){
        event.preventDefault();
        win.hide();
    });

    win.on('close', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            win.hide();
        }

        return false;
    });

    win.on('hide', function() {
        win['currentWindowState'] = 'hidden';
        contextMenu.getMenuItemById('show-win').enabled = true;
        contextMenu.getMenuItemById('hide-win').enabled = false;
        tray.setContextMenu(contextMenu);
    });

    win.on('show', function() {
        win['currentWindowState'] = 'shown';
        contextMenu.getMenuItemById('show-win').enabled = false;
        contextMenu.getMenuItemById('hide-win').enabled = true;
        tray.setContextMenu(contextMenu);
    });

    win.webContents.on('new-window', handleRedirect)
    // manage size/positio of the window
    // so it can be restore next time
    mainWindowState.manage(win);
}


app.requestSingleInstanceLock();
app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        win.show();
        win.focus();
    }
});

app.on('ready', createWindow);
