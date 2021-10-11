import util from 'util';
import figlet from 'figlet';
import log from 'log-beautify';
import { oraPromise } from 'ora';
import cp from 'child_process'
const exec = util.promisify(cp.exec);

async function runCommand(command) {
    const { stdout, stderr } = await oraPromise(exec(command), `Executing "${command}"`);
    if (stdout) {
        log.success(`Command "${command}" was executed successfully`);
        log.show(stdout);
        log.show();
    }
    if (stderr) {
        log.error(`Encountered following errors while executing "${command}"`);
        log.show(stderr);
        log.show();
    };
}

(_ => {
    figlet('Zepto-ai', function(err, data) {
        if (err) {
            return;
        }
        console.log(data)
        console.log("\n");
    });
})();


setTimeout(async () => {    
    await runCommand("npm run build:mix");

    if (process.platform == "darwin") {
        await runCommand("npm run build:app-m");
    } else if (process.platform == "win32") {
        await runCommand("npm run build:app-w");
    }

    try {
        await runCommand("docker image rm zepto-image");
    } catch(error) {}
    await runCommand(`docker build -t zepto-image . --build-arg TOKEN=${process.env.GH_TOKEN}`);    
    try {
        await runCommand("docker run --name zeptoBuilds zepto-image");
    } catch (err) {
        if (err.stderr.startsWith("docker: Error response from daemon: Conflict.")) {
            await runCommand("docker container rm zeptoBuilds");
            await runCommand("docker run --name zeptoBuilds zepto-image");
        }
    }
}, 1000);