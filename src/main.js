const {app, BrowserWindow, Tray, Menu, globalShortcut} = require('electron');
const shell = require('electron').shell;
const path = require('path');
const url = require('url');

let win = null;
let tray = null;
let currentWindowState = 'shown';

function handleRedirect(e, url) {
    // there may be some popups on the same page
    if(url == win.webContents.getURL()) {
        return true;
    }

    // when user is logged in there is link
    // asks to update the page. It should be opened
    // in the app and not in the external browser
    if (url == 'https://todoist.com/app') {
        win.reload();
        return true;
    }

    e.preventDefault()
    shell.openExternal(url)
}

function createTray(win) {
    tray = new Tray(path.join(__dirname, 'icons/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show', click:  function(){
            win.show();
        } },
        { label: 'Quit', click:  function(){
            app.isQuiting = true;
            app.quit();
        } }
    ]);
    tray.setToolTip('Todoist');
    tray.setContextMenu(contextMenu);
}

function setupShortcuts(win)
{
    // quick add task
    globalShortcut.register('CommandOrControl+Alt+a', () => {
        // open quick add popup
        win.webContents.sendInputEvent({
            type: "char",
            keyCode: 'q'
        });
        win.show();
    });

    // show/hide
    globalShortcut.register('CommandOrControl+Alt+t', () => {
        if (currentWindowState == 'hidden') {
            win.show();
            return;
        }

        win.hide();
    });

    // reload page
    globalShortcut.register('CommandOrControl+Alt+r', () => {
        if (currentWindowState == 'shown') {
            win.reload();
        }
    });
}

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Todoist',
        icon: path.join(__dirname, 'icons/icon.png')
    });

    win.setMenu(null);

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    createTray(win);
    setupShortcuts(win);

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
        currentWindowState = 'hidden';
    });

    win.on('show', function() {
        currentWindowState = 'shown';
    });

    win.webContents.on('new-window', handleRedirect)
}


var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        win.show();
        win.focus();
    }
});

if (shouldQuit) {
    app.quit();
    return;
}

app.on('ready', createWindow);

app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);
