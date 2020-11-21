function initOpenInstall(key,code) {
    var appKey = key;
    var channelCode = code;
    var data = OpenInstall.parseUrlParams() || {};
    if (!data.channelCode) {
        data.channelCode = channelCode;
    }
    return new OpenInstall({
        appKey: appKey,
        channelCode: data.channelCode,
        onready: function () {
            this.__proto__.isReady = true
        }
    }, data);
}