const { app, session } = require("electron");

function setCustomUserAgent() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            details.requestHeaders["User-Agent"] =
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36";
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        }
    );
}

function instanceLock() {
    var gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        app.quit();
    } else {
        app.on("second-instance", () => {
            // Someone tried to run a second instance, we should focus our window.
            if (win) {
                if (win.isMinimized()) {
                    win.restore();
                    win.focus();
                }
                win.show();
                win.focus();
            }
        });
    }
}

module.exports = { setCustomUserAgent, instanceLock };
