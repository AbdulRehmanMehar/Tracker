import connect from "react-watcher";
import React, { useEffect } from "react";
const { ipcRenderer } = require('electron');
import './index.css';

class Updater extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            headline: null,
            information: null,
            callToAction: null
        }

        ipcRenderer.send('versionInfo');
        
    }

    componentDidMount() {
        const { watch } = this.props;
        if (this.props.status == 'gotAnUpdate') this.setStateForUpdateFound();
        else if (this.props.status == 'downloadedTheUpdate') this.setStateForUpdateDownloaded();


        watch('status', (status) => {
            console.log(status == 'gotAnUpdate', status);
            if (status == 'gotAnUpdate') this.setStateForUpdateFound();
            else if (status == 'downloadedTheUpdate') this.setStateForUpdateDownloaded();
        });
    }

    setStateForUpdateFound() {
        this.setState({ title: 'Update Available' });
        this.setState({ headline: 'Found An Update' });
        this.setState({ information: 'Feel free to use this application while we download...' });
        this.setState({ callToAction: 'Close' });
    }

    setStateForUpdateDownloaded() {
        this.setState({ title: 'Ready to Update' });
        this.setState({ headline: 'Downloaded the update' });
        this.setState({ information: 'Click on the button below to update and restart the application' });
        this.setState({ callToAction: 'Install' });
    }

    executeAction() {
        
        ipcRenderer.send('restartToUpdate');
        
    }

    render() {
        let btn;
        if (this.props.status == 'gotAnUpdate') {
            btn = <button className="button is-dark my-2" onClick={() => {
                this.props.makeUpdaterVisibile(false)
            }}>{ this.state.callToAction }</button>;
        } else {
            btn = <button className="button is-dark my-2" onClick={this.executeAction}>{ this.state.callToAction }</button>;
        }

        return (
            <div className="modal-wrapper show">
                <div id="modal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className={(process.platform == 'darwin') ? "close" : "close right"} title="close" onClick={ () => {
                                this.props.makeUpdaterVisibile(false)
                            } }></div>
                            <span className="modal-title">{ this.state.title }</span>
                        </div>
                        <div className="modal-body">
                            <div className="my-2">
                                <h2 className="is-size-5 my-1">{ this.state.headline }</h2>
                                <p className="is-size-7">{ this.state.information }</p>
                            </div>
                            {btn}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(Updater);