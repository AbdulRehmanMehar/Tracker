import * as path from "path";

const notifier = require('node-notifier');

function notify (title, message) {

    let iconPath = './resources/icon.png';
    if (isPackaged) iconPath = path.join(__dirname, '../../../resources/icon.png');

     notifier.notify({
        appID: 'Zepto-ai',
        title: title,
        message: message,
        icon: iconPath
    });
}


export default notify;