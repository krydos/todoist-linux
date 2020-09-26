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

function createTray(win) {
  const configInstance = new ShortcutConfig();

  // if tray-icon is set to null in config file then don't create a tray icon
  if (!config['tray-icon']) {
    return;
  }

  tray = new Tray(path.join(__dirname, `icons/${config['tray-icon']}`));
  contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Todoist',
      click:  function() {
        win.show();
      },
      id: 'show-win'
    },
    {
      type: 'separator'
    },
    {
      label: 'Add task',
      click:  function() {
        win.webContents.sendInputEvent({
          type: "keyDown",
          keyCode: "Escape"
        });
        win.webContents.sendInputEvent({
          type: "keyUp",
          keyCode: "Escape"
        });
        win.webContents.sendInputEvent({
          type: "char",
          keyCode: 'q'
        });
        win.show();
        win.webContents.send('focus-quick-add');
      },
      id: 'add-task'
    },
    {
      label: 'Search',
      click:  function() {
        win.webContents.sendInputEvent({
          type: "keyDown",
          keyCode: "Escape"
        });
        win.webContents.sendInputEvent({
          type: "keyUp",
          keyCode: "Escape"
        });
        win.webContents.sendInputEvent({
          type: "char",
          keyCode: 'f'
        });
        win.show();
      },
      id: 'search'
    },
    {
      label: 'Inbox',
      click:  function() {
        win.show();
        win.webContents.send('go-to-anchor', 'filter_inbox');
      },
      id: 'inbox'
    },
    {
      label: 'Today',
      click:  function() {
        win.show();
        win.webContents.send('go-to-anchor', 'filter_today');
      },
      id: 'today'
    },
    {
      label: 'Upcoming',
      click:  function() {
        win.show();
        win.webContents.send('go-to-anchor', 'filter_upcoming');
      },
      id: 'upcoming'
    },
    {
      type: 'separator'
    },
    {
      label: 'Preferences',
      click:  function() {
        shell.openItem(path.join(
          configInstance.getConfigDirectory(),
          '.todoist-linux.json'
        ));
      },
      id: 'preferences'
    },
    {
      label: 'Report an issue',
      click:  function() {
        shell.openExternal('https://github.com/KryDos/todoist-linux/issues/new');
      },
      id: 'report-issue'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit Todoist',
      click:  function() {
        app.isQuitting = true;
        app.quit();
      },
      id: 'quit'
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

  // react on close and minimize
  win.on('minimize',function(event){
    event.preventDefault();
    win.hide();
  });

  win.on('close', function (event) {
    // we should not hide the window if there is no tray icon
    // because user will not be able to close the app
    if (!config['tray-icon']) {
      app.isQuitting = true;
    }

    if(!app.isQuitting){
      event.preventDefault();
      win.hide();
    }

    return false;
  });

  // manage size/position of the window
  // so it can be restored next time
  mainWindowState.manage(win);
}

function handleRedirect(e, url) {
  // there may be some popups on the same page
  if (url == win.webContents.getURL()) {
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

  /*
   * The first time the settings button is clicked 
   * the 'new-window' event is emitted with the url to the settings page
   * The electron default behavior(creating a new window) is prevented 
   * and instead the contents of the main window are reloaded with the contents 
   * from the settings page effectively emulating the behavior of the website
   */
  if (/prefs\/account/.test(url)) {
    e.preventDefault();
    win.loadURL(url);
    return true;
  }

  e.preventDefault()
  shell.openExternal(url)
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
