const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  session
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const shell = require('electron').shell;
const path = require('path');
const url = require('url');

const {ShortcutConfig} = require('./shortcutConfig');
const shortcuts = require('./shortcuts');

let win = {};
let gOauthWindow = undefined;
let tray = null;
let contextMenu;
let config = {};

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
   * In case of google or facebook oauth login
   * let's create another window and listen for
   * its "close" event.
   * As soon as that event fired we can refresh our
   * main window.
   */
  if (/google.+?oauth/.test(url) || /facebook.+?oauth/.test(url)) {
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
  tray = new Tray(path.join(__dirname, `icons/${config['tray-icon']}`));
  contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click:  function() {
        win.show();
      },
      enabled: false,
      id: 'show-win'
    },
    {
      label: 'Hide',
      click:  function() {
        win.hide();
      },
      id: 'hide-win'
    },
    {
      label: 'Toggle FullScreen',
      click:  function() {
        win.setFullScreen(!win.isFullScreen());
      },
    },
    {
      label: 'Quit',
      click:  function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Todoist');
  tray.setContextMenu(contextMenu);
}

function setCustomUserAgent() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}

function createWindow () {
  setCustomUserAgent();

  const configInstance = new ShortcutConfig();
  config = configInstance.config;

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
    minHeight: 600,
    minWidth: 420,
    title: 'Todoist',
    icon: path.join(__dirname, 'icons/icon.png')
  });


  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, (config['beta'] ? 'beta.html' : 'index.html')),
    protocol: 'file:',
    slashes: true
  }));

  createTray(win);
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
    contextMenu.getMenuItemById('show-win').enabled = true;
    contextMenu.getMenuItemById('hide-win').enabled = false;
    tray.setContextMenu(contextMenu);
  });

  win.on('show', function() {
    contextMenu.getMenuItemById('show-win').enabled = false;
    contextMenu.getMenuItemById('hide-win').enabled = true;
    tray.setContextMenu(contextMenu);
  });

  win.webContents.on('new-window', handleRedirect)
  // manage size/positio of the window
  // so it can be restore next time
  mainWindowState.manage(win);
}

var gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()){
        win.restore();
        win.focus();
      }
      win.show();
      win.focus();
    }
  });
}

app.on('ready', createWindow);
