const {app, BrowserWindow, Tray, Menu, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');

function createTray(win) {
    let tray = new Tray('icons/icon.png');
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
    globalShortcut.register('CommandOrControl+Alt+a', () => {
        console.log('shortcut is pressed');

        // open quick add popup
        win.webContents.sendInputEvent({
            type: "char",
            keyCode: 'q'
        });
        win.show();
    });
}

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
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
}

app.on('ready', createWindow);
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('force-device-scale-factor', 1);
