const { globalShortcut } = require('electron');
const {ShortcutConfig} = require('./shortcutConfig');

class shortcuts {
    constructor(win, app) {
        this.win = win;
        this.app = app;
        this.shortcutConfig = new ShortcutConfig();
    }

    registerAllShortcuts() {
        this.registerQuickAddShortcut();
        this.registerShowHideShortcut();
        this.registerReloadShortcut();
        this.registerQuitShortcut();
    }

    // open quick add popup
    registerQuickAddShortcut() {
        globalShortcut.register(this.shortcutConfig.config['quick-add'], () => {
            this.win.webContents.sendInputEvent({
                type: "char",
                keyCode: 'q'
            });
            this.win.show();
            this.win.webContents.send('focus-quick-add');
        });
    }

    // show/hide
    registerShowHideShortcut() {
        globalShortcut.register(this.shortcutConfig.config['show-hide'], () => {
            if (!this.win.isFocused()) {
                this.win.show();
                this.win.focus();
                return;
            }
            
            this.win.hide();
        });
    }

    // reload page
    registerReloadShortcut() {
        globalShortcut.register(this.shortcutConfig.config['refresh'], () => {
            if (this.win.isFocused()) {
                this.win.reload();
            }
        });
    }

    registerQuitShortcut() {
        globalShortcut.register(this.shortcutConfig.config['quit'], () => {
            // isQuiting is important for
            // on('close') event where this variable is checked.
            // In case it is not true then the app just minimized.
            this.app.isQuiting = true;
            this.app.quit();
        });
    }
}

module.exports = shortcuts;
