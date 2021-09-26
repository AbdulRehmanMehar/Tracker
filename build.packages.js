const util = require('util');
const { GH_TOKEN } = require('./variables.js').vars;
const exec = util.promisify(require('child_process').exec);

async function runCommand(command) {
    const { stdout, stderr } = await exec(command);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
}


(async () => {
    await runCommand("npm run build:mix");

    if (process.platform == "darwin") {
        await runCommand("npm run build:app-m");
    }

    await runCommand(`docker build -t zepto-image . --build-arg TOKEN=${GH_TOKEN}`);

    await runCommand("docker run zepto-image");
})();