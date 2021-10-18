import React from "react";
import "./styles.global.scss";
import { ipcRenderer } from 'electron';
import Updater from "./components/Updater";
import Signin from "./components/SignIn.jsx";
import PrivateRoute from "./PrivateRoute.js";
import * as os from 'os';
import Tracker from "./components/Tracker.jsx";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { enableAXDocumentForJetBrains, enableAXDocumentForVsCode } from './helpers/darwin-config';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showUpdater: false,
      updateStatus: null,
    }
  }

  async componentDidMount() {
    ipcRenderer.on('gotAnUpdate', (event, arg) => {
      this.makeUpdaterVisibile(true);
      ipcRenderer.removeAllListeners('gotAnUpdate');
      this.setState({updateStatus:  'gotAnUpdate'});
    });

    ipcRenderer.on('downloadedTheUpdate', (event, arg) => {
      this.makeUpdaterVisibile(true);
      ipcRenderer.removeAllListeners('downloadedTheUpdate');
      this.setState({updateStatus:  'downloadedTheUpdate'}); 
    });

    if (os.platform() === 'darwin') {
      await enableAXDocumentForVsCode();
      await enableAXDocumentForJetBrains();
    }
  }

  makeUpdaterVisible(show) {
    this.setState({ showUpdater: show });
  }

  render() {
    let upd;
    if (this.state.showUpdater) {
      upd = <Updater status={this.state.updateStatus} makeUpdaterVisible={(show) => {
        this.makeUpdaterVisible(show)
      }} />;
    }

    return (
      <div>
        {upd}
        <Router>
          <Switch>
            <PrivateRoute exact={true} path="/" component={Tracker} />
            <Route path="/signin" component={Signin} />
          </Switch>
        </Router>
      </div>
    );
  }
}
