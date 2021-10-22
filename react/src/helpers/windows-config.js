const os = require('os');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const util = require("util");
const {isPackaged} = require("electron-is-packaged");
const exec = util.promisify(cp.exec);
const sudo = require('sudo-prompt');

process.platform = os.platform()

let runCommand = async (command, args = {}) => {
    const { stdout, stderr } = await exec(command, args);
    if (stdout) {
        return stdout;
    }
    if (stderr) {
        return stderr;
    }
    return null;
}



export let verifyHandleInPathOrAddIt = async () => {
    try {
        let output = await runCommand('handle.exe');
    } catch (e) {
        if (e.stderr.includes("'handle.exe' is not recognized as an internal or external command")) {
            const homedir = require('os').homedir();
            let destination = path.join(homedir, 'AppData/Local/Microsoft/WindowsApps')
            let host = path.join(__dirname, '../../resources/win32/handle.exe');
            if (isPackaged) host = path.join(__dirname, '../../../resources/win32/handle.exe');

            let iconPath = './resources/icon.png';
            if (isPackaged) iconPath = path.join(__dirname, '../../../resources/icon.png');
            sudo.exec(`copy "${host}" "${destination}"`, {
                name: 'Zepto',
                icns: iconPath
                },
                function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('stdout: ' + stdout);
                }
            );

        }
    }
}
