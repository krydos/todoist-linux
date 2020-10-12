const { session } = require("electron");

function setCustomUserAgent() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            details.requestHeaders["User-Agent"] =
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36";
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        }
    );
}

module.exports = { setCustomUserAgent };
