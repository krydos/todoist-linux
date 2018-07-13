const { globalShortcut } = require('electron');

class shortcuts {
    constructor(win) {
        this.win = win;
    }

    registerAllShortcuts() {
        this.registerQuickAddShortcut();
        this.registerShowHideShortcut();
        this.registerReloadShortcut();
    }

    // open quick add popup
    registerQuickAddShortcut() {
        globalShortcut.register('CommandOrControl+Alt+a', () => {
            this.win.webContents.sendInputEvent({
                type: "char",
                keyCode: 'q'
            });
            this.win.show();
        });
    }

    // show/hide
    registerShowHideShortcut() {
        globalShortcut.register('CommandOrControl+Alt+t', () => {
            if (this.win.currentWindowState == 'hidden') {
                this.win.show();
                return;
            }

            this.win.hide();
        });
    }

    // reload page
    registerReloadShortcut() {
        globalShortcut.register('CommandOrControl+Alt+r', () => {
            if (this.win.currentWindowState == 'shown') {
                this.win.reload();
            }
        });
    }
}

module.exports = shortcuts;