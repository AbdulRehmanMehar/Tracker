const fs = require('fs');
const axios = require('axios');
const pjson = require('./package.json');
const { exec } = require('child_process');
const simpleGit = require('simple-git');
const git = simpleGit('./dist');

const current_branch = `release-v${pjson.version}`;
const baseUrl = `https://gitlab.com/api/v4/projects/${process.env.GL_PROJECT_ID}`
const repo_name = (process.env.GL_RELEASE_REPO).split('/').pop().split('.').shift();


const instance = axios.create({
    baseURL: baseUrl,
    headers: {'PRIVATE-TOKEN': process.env.GL_API_TOKEN}
});

let fetch = async (url, method='GET', data=null) => {
    try {
        return await instance.request({
            method,
            url,
            data
        })
    } catch (error) {
        console.log(error);
    }
};


(async () => {
    try {

    
        // Clone the Repository
        console.log(`Cloning ${repo_name} using ${process.env.GL_RELEASE_REPO}...`);
        await git.clone(process.env.GL_RELEASE_REPO, {'--single-branch': true});
        console.log('Cloning Completed');


        // Checkout Release Branch
        await git.cwd({ path: `./dist/${repo_name}`, root: true })
            .checkoutBranch(current_branch, 'main');
        console.log(`Checked out ${current_branch} from main`);


        // Copy Assets
        console.log('Copying Files...');
        fs.copyFileSync('./dist/latest.yml', `./dist/${repo_name}/latest.yml`);
        fs.copyFileSync(`./dist/zepto Setup ${pjson.version}.exe`, `./dist/${repo_name}/zepto Setup ${pjson.version}.exe`);
        fs.copyFileSync(`./dist/zepto Setup ${pjson.version}.exe.blockmap`, `./dist/${repo_name}/zepto Setup ${pjson.version}.exe.blockmap`);
        console.log('Copy Completed');


        // Commit the Assets
        await git
            .cwd({ path: `./dist/${repo_name}`, root: true })
            .add([
                './latest.yml',
                `./zepto Setup ${pjson.version}.exe`,
                `./zepto Setup ${pjson.version}.exe.blockmap`
            ])
            .commit(`Zepto Desktop - Release v${pjson.version}`);
        console.log(`Commited copied files`);


        // Push to Gitlab
        console.log(`Pushing ${current_branch} to Gitlab`);
        await git
            .cwd({ path: `./dist/${repo_name}`, root: true })
            .push('origin', current_branch, {'--set-upstream': true});
        console.log(`Pushed ${current_branch}`);
    


        // Release
        await fetch('/releases', 'POST', {
            name: `Zepto-ai Release v${pjson.version}`,
            tag_name: current_branch,
            description: `Let's see what happens...`,
            ref: current_branch,
            assets: {
                links: [
                    {
                        name: `zepto Setup ${pjson.version}.exe`,
                        url: `${baseUrl}/repository/files/zepto%20Setup%20${pjson.version}.exe/raw?ref=${current_branch}`
                    },
                    {
                        name: `zepto Setup ${pjson.version}.exe.blockmap`,
                        url: `${baseUrl}/repository/files/zepto%20Setup%20${pjson.version}.exe.blockmap/raw?ref=${current_branch}`
                    },
                    {
                        name: 'latest.yml',
                        url: `${baseUrl}/repository/files/latest.yml/raw?ref=${current_branch}`
                    }
                ]
            }
        });


        // Cleanup 
        fs.rmSync(`./dist/${repo_name}`, { recursive: true });
    } catch (error) {
        if (fs.existsSync(`./dist`)) fs.rmSync(`./dist`, { recursive: true });
        console.log('Something went wrong...');
    }
})();

