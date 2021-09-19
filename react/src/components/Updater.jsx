import Axios from 'axios';
import React from "react";
import fileDownload from 'js-file-download';
const { ipcRenderer } = require('electron');

export default class Updater extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            versionInfo: '',
            updateMessage: 'You are running latest version',
            updateAvailable: false,
        }

        ipcRenderer.send('versionInfo');
        
    }

    componentDidMount() {
        console.log('mounted updater');

        ipcRenderer.on('versionInfo', (event, arg) => {
            this.setState({versionInfo: arg.version})
        });
        ipcRenderer.on('gotAnUpdate', (event, arg) => {
            ipcRenderer.removeAllListeners('gotAnUpdate');
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