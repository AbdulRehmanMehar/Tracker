const fs = require('fs');
const { Octokit } = require("@octokit/core");


let authToken;

if (fs.existsSync('./variables.js')) {
    const { GH_TOKEN } = require('./variables.js').vars;
    authToken = GH_TOKEN;
    
} else {
    authToken = process.env.GH_TOKEN;
}

const octokit = new Octokit({ auth: authToken });

(async () => {
    let response = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner: "projdako",
        repo: "zepto-desktop-releases",
        type: "private",
    });

    
    let drafted = [];
    for (let release of response.data) {
        if (release.draft) drafted.push(release.id);
    }

    console.log(drafted);


    for (let id of drafted) {
        response = await octokit.request('PATCH /repos/{owner}/{repo}/releases/{release_id}', {
            owner: "projdako",
            repo: "zepto-desktop-releases",
            private: true,
            release_id: id,
            draft: false
        });
    }
})();
