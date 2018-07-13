const { globalShortcut } = require('electron');
const {ShortcutConfig} = require('./shortcutConfig');

class shortcuts {
    constructor(win) {
        this.win = win;
        this.shortcutConfig = new ShortcutConfig();
    }

    registerAllShortcuts() {
        this.registerQuickAddShortcut();
        this.registerShowHideShortcut();
        this.registerReloadShortcut();
    }

    // open quick add popup
    registerQuickAddShortcut() {
        globalShortcut.register(this.shortcutConfig.config['quick-add'], () => {
            this.win.webContents.sendInputEvent({
                type: "char",
                keyCode: 'q'
            });
            this.win.show();
        });
    }

    // show/hide
    registerShowHideShortcut() {
        globalShortcut.register(this.shortcutConfig.config['show-hide'], () => {
            if (this.win.currentWindowState == 'hidden') {
                this.win.show();
                return;
            }

            this.win.hide();
        });
    }

    // reload page
    registerReloadShortcut() {
        globalShortcut.register(this.shortcutConfig.config['refresh'], () => {
            if (this.win.currentWindowState == 'shown') {
                this.win.reload();
            }
        });
    }
}

module.exports = shortcuts;