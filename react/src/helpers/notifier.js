import * as path from "path";

const notifier = require('node-notifier');

function notify (title, message) {

     notifier.notify({
        appID: 'Zepto-ai',
        title: title,
        message: message,
        icon: '../../../assets/icon.png'
    });
}


export default notify;