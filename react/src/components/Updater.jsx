import Axios from 'axios';
import React from "react";
import fileDownload from 'js-file-download';
const { ipcRenderer } = require('electron');

function saveFile(token, url, filename) {
    return new Promise(function(resolve, reject) {
      // Get file name from url.
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function() {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.setRequestHeader('PRIVATE-TOKEN', token);
      xhr.send();
    }).then(function(xhr) {
      
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      a.download = filename; // Set the file name.
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      return xhr;
    });
  }


  function download(token, urls) {
    var cur = Promise.resolve();
    urls.forEach(function(url) {
        console.log(url);
      cur = cur.then(function() {
        return saveFile(token, url.direct_asset_url, url.name);
      });
    });
    return cur;
  }

// let downloadAsset = (token, downloadUrl, fileName) => {
//     var postData = new FormData();
// 		var xhr = new XMLHttpRequest();
// 		xhr.open('GET', downloadUrl, true);
//         xhr.setRequestHeader('PRIVATE-TOKEN', token);
// 		xhr.responseType = 'blob';
// 		xhr.onload = function (e) {
// 			var blob = xhr.response;
// 			var assetRecord = this.getAssetRecord();
//             var tempEl = document.createElement("a");
//             document.body.appendChild(tempEl);
//             tempEl.style = "display: none";
//             url = window.URL.createObjectURL(blob);
//             tempEl.href = url;
//             tempEl.download = fileName;
//             tempEl.click();
//             window.URL.revokeObjectURL(url);
// 		}.bind(this)
// 		xhr.send(postData);
// }

// let downloadAssets = (GL_TOKEN, url) => {
//     const url_array = url.split('/');
//     const filename = url_array[url_array.length - 2];
//     console.log(filename);
//     Axios.get(url, {
//         responseType: 'blob',
//         headers: {'PRIVATE-TOKEN': GL_TOKEN}
//     }).then(res => {
//         fileDownload(res.data, `zepto/${filename}`);
//     })
// }

export default class Updater extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            versionInfo: '',
            filePaths: [],
            downloadablesLength: 0,
            numberOfFilesDownloaded: 0,
            updateMessage: 'You are running latest version',
            updateAvailable: false,
        }

        ipcRenderer.send('checkForUpdates');
        
    }

    componentDidMount() {
        console.log('mounted updater');

        ipcRenderer.on('versionInfo', (event, arg) => {
            this.setState({versionInfo: arg.version})
        });
        ipcRenderer.on('gotAnUpdate', (event, arg) => {
            ipcRenderer.removeAllListeners('gotAnUpdate');
            this.setState({downloadablesLength: arg.assetURLs.length});

            download(arg.GL_TOKEN, arg.assetURLs)
                .then(() => {
                    console.log('Download Completed');
                    
                }).catch(() => {
                    ipcRenderer.send('assetDownloadFailure');
                });
                
            this.setState({updateMessage:  'A new update is available. Downloading now...'});
        });
        ipcRenderer.on('downloadComplete', (event, arg) => {
            this.setState({filePaths: [...this.state.filePaths, arg.filePath]})
            this.setState({numberOfFilesDownloaded: this.state.numberOfFilesDownloaded + 1 });
            console.log(this.state.numberOfFilesDownloaded, this.state.downloadablesLength);
            if (this.state.numberOfFilesDownloaded == this.state.downloadablesLength) {
                ipcRenderer.send('installUpdates', this.state.filePaths.find(path => path.split('.').pop() == 'exe'));
            }
        });

        ipcRenderer.on('downloadedTheUpdate', (event, arg) => {
            ipcRenderer.removeAllListeners('downloadedTheUpdate');
            this.setState({updateMessage:  'Downloaded! Click on the button to update'});
            this.setState({updateDownloaded: true})
        });
    }

    executeUpdate() {
        ipcRenderer.send('restartToUpdate');
    }

    render() {
        return (
            <div className="m-5">
                <p>
                    Current Version: 
                    <span>{this.state.versionInfo}</span>
                </p>
                <p>Hopefully, It'll detect the new version</p>
                <p>{this.state.updateMessage}</p>

                <div style={{'display': (this.state.updateDownloaded) ? 'block' : 'none'}}>
                    
                    <button onClick={this.executeUpdate}>Update Now</button>
                </div>
            </div>
        )
    }
}