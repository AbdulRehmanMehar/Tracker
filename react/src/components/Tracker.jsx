import * as os from 'os';
import * as path from "path";
import React from "react";
const activeWin = require("active-win");
import * as osascript from "node-osascript";
import notify from "../helpers/notifier";
import API from "../api.js";
import ViewedApp from './ViewedApp.jsx';
import * as workerTimers from 'worker-timers';


class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.getWindow = this.getWindow.bind(this);
    this.state = {
      res: "",
      mouseLoc: [0, 0],
      draftIds: {},
      wordIds: {}
    };
  }

  componentDidMount() {
    try {
    notify('Tracking Started', 'Feel free to use your system while tracking');
    }
    catch(e){
        console.log(e)
    }

    this.trackInterval = workerTimers.setInterval(this.getWindow, 5000);
    
  }

  sendWordEvent = (data, mouseMoved) => {
    const { wordIds } = this.state;
    console.log(data);

    if (data.filePath && wordIds[data.filePath]) {
      const formData = new FormData();
      formData.append("timestamp", Math.round(Date.now() / 1000));
      if (mouseMoved) formData.append("action", "activePing");
      else formData.append("action", "ping");

      formData.append("isBrowser", false);
      formData.append("isVisible", true);

      const sessionId = wordIds[data.filePath];
      API.post("core/office/event/" + sessionId + "/", formData).then(
        result => {}
      );
    } else if (data.filePath) {
      const formData = new FormData();
      formData.append("filepath", data.filePath);
      formData.append("isWindows", process.platform == "darwin" ? false : true);
      API.post("core/office/session/start/", formData).then(result => {
        const buffWordIds = wordIds;
        buffWordIds[data.filePath] = result.data.id;
        this.setState({ wordIds: buffWordIds });
      });
    }

    /*const filePath = data[2] !== "missing value" ? data[2] : "";
    const fileId = filePath ? filePath : data[9];

    if (!wordIds[data[2]] && !wordIds[data[9]]) {
      const formData = new FormData();
      formData.append("filepath", fileId);
      formData.append("isWindows", process.platform == "darwin" ? false : true);
      API.post("core/office/session/start/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(result => {
        const buffWordIds = wordIds;
        buffWordIds[fileId] = {};
        buffWordIds[fileId].sessionId = result.data.id;
        buffWordIds[fileId].item = result.data.item;
        buffWordIds[fileId].path = result.data.filepath;
        if (filePath) buffWordIds[fileId].hasPath = true;
        this.setState({ wordIds: buffWordIds });
      });
    } else if (
      (wordIds[data[9]] && wordIds[data[9]].path != filePath) ||
      (wordIds[filePath] && wordIds[filePath].path != filePath)
    ) {
      const formData = new FormData();
      formData.append(
        "filepath",
        data[2] !== "missing value" ? data[2] : data[9]
      );
      formData.append("isWindows", process.platform == "darwin" ? false : true);
      const sessionId =
        filePath && wordIds[data[2]]
          ? wordIds[data[2]].sessionId
          : wordIds[data[9]].sessionId;
      API.post("core/office/session/" + sessionId + "/save/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(result => {
        const buffWordIds = wordIds;
        if (buffWordIds[data[9]]) delete buffWordIds[data[9]];
        else delete buffWordIds[wordIds[filePath].path];

        buffWordIds[fileId] = {};
        buffWordIds[fileId].sessionId = result.data.id;
        buffWordIds[fileId].item = result.data.item;
        buffWordIds[fileId].path = result.data.filepath;
        this.setState({ wordIds: buffWordIds });
      });
    } else {
      const formData = new FormData();
      formData.append("timestamp", Math.round(Date.now() / 1000));
      if (mouseMoved) formData.append("action", "activePing");
      else formData.append("action", "ping");

      formData.append("isBrowser", false);
      formData.append("isVisible", true);

      const sessionId = wordIds[data[2]]
        ? wordIds[data[2]].sessionId
        : wordIds[data[9]].sessionId;
      API.post("core/office/event/" + sessionId + "/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(result => {});
    }*/
    /*if(!wordIds[data[9]] && !wordIds[data[2]]) {
          
              const formData = new FormData()
              formData.append('filepath', data[2] !== "missing value" ? data[2] : data[9])
              formData.append('isWindows', process.platform == 'darwin' ? false : true)
              API.post('core/office/session/start/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }).then((result)=>{
                  const buffWordIds = wordIds
                  if(!filePathAvail && data[2] == 'missing value'){
                      buffWordIds[data[9]] = {}
                      buffWordIds[data[9]].sessionId = result.data.id
                      buffWordIds[data[9]].item = result.data.item
                      buffWordIds[data[9]].path = result.data.filepath
                  }
                  else {
                      buffWordIds[data[2]] = {}
                      buffWordIds[data[2]].sessionId = result.data.id
                      buffWordIds[data[2]].item = result.data.item
                      buffWordIds[data[2]].path = result.data.filepath
                  }
                  this.setState({wordIds: buffWordIds})
              })
          
      }
      
      else if(data[2] !== 'missing value' && ((filePathAvail && wordIds[data[2]].path != data[2]) || (!filePathAvail && wordIds[data[2]].path != data[2]))) {
          
               const formData = new FormData()
               formData.append('filepath', data[2] !== "missing value" ? data[2] : data[9])
               formData.append('isWindows', process.platform == 'darwin' ? false : true)
               const sessionId = wordIds[data[2]] ? wordIds[data[2]].sessionId : wordIds[data[9]].sessionId
               API.post('core/office/session/'+sessionId+'/save/', formData, {
                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
               }).then((result)=>{
                  const buffWordIds = wordIds
                  buffWordIds[data[2]] = {}
                  buffWordIds[data[2]].sessionId = result.data.id
                  buffWordIds[data[2]].item = result.data.item
                  buffWordIds[data[2]].path = result.data.filepath
                  this.setState({wordIds: buffWordIds})
               })
      }
      
      else {
          
           const formData = new FormData()
           formData.append('timestamp', Math.round(Date.now()/1000))
           if(mouseMoved)
            formData.append('action', 'activePing')

          else
            formData.append('action', 'ping')
          
           formData.append('isBrowser', false)
           formData.append('isVisible', true)
          
           const sessionId = wordIds[data[2]] ? wordIds[data[2]].sessionId : wordIds[data[9]].sessionId
           API.post('core/office/event/'+sessionId+'/', formData, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           })
           .then((result)=>{
               
           })
      }*/
  };

  sendOutlookWriteEvent = (data, mouseMoved) => {
    const { draftIds } = this.state;

    console.log(draftIds);
    const formData = new FormData();
    formData.append("customId", data[6]);
    formData.append("timestamp", Math.round(Date.now() / 1000));
    if (mouseMoved) formData.append("action", "activePing");
    else formData.append("action", "ping");
    formData.append("isBrowser", false);
    formData.append("isVisible", true);
    API.post("core/outlook/event/", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(result => {
      if (!draftIds[data[6]]) {
        const buffDraftIds = draftIds;
        buffDraftIds[data[6]] = { id: Object.keys(buffDraftIds).length };
        this.setState({ draftIds: buffDraftIds });
      }
    });

    if (
      draftIds[data[6]] &&
      (draftIds[data[6]].subject != data[7] ||
        draftIds[data[6]].body != data[8])
    ) {
      const buffDraftIds = draftIds;
      buffDraftIds[data[5]].subject = data[7];
      buffDraftIds[data[5]].body = data[8];
      this.setState({ draftIds: buffDraftIds });
      const formData = new FormData();
      formData.append("subject", data[7]);
      formData.append("bodyPreview", data[8]);
      API.patch("core/outlook/event/" + data[6] + "/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { idType: "custom_id" }
      });
    }
  };

  getWindow() {
      
      const thisApp = this;
      activeWin().then(activeWin => {
        if (os.platform() === 'darwin') {
          osascript.executeFile(
             path.join(__dirname, "./get-foreground-window-title.osa"),
            function(err, path1, raw) {
              console.log('foreground', path1, raw);
              osascript.executeFile(
                 path.join(__dirname, "./get-mouse-location.osa"),
                function(err, mouseLoc, raw) {
                  console.log('mouse', mouseLoc, raw);
                  if (path[6])
                    thisApp.sendOutlookWriteEvent(
                      path,
                      mouseLoc[0] != thisApp.state.mouseLoc[0] &&
                        mouseLoc[1] != thisApp.state.mouseLoc[1]
                    );

                  if (path[9]) {
                    let dataNormalize = {};
                    dataNormalize.appName = path[0];
                    dataNormalize.docTitle = path[1];
                    dataNormalize.filePath =
                      path[2] != "missing value" && path[2] ? path[2] : null;
                    dataNormalize.fileName = path[9];
                    thisApp.sendWordEvent(
                      dataNormalize,
                      mouseLoc[0] != thisApp.state.mouseLoc[0] &&
                        mouseLoc[1] != thisApp.state.mouseLoc[1]
                    );
                  }

                  thisApp.setState({
                    prevApp: thisApp.state.res ? thisApp.state.res : null,
                    res: JSON.stringify(activeWin) + path + mouseLoc + Date.now()
                  });
                  if (
                    mouseLoc[0] != thisApp.state.mouseLoc[0] &&
                    mouseLoc[1] != thisApp.state.mouseLoc[1]
                  ) {
                    console.log("Mouse moved");
                    thisApp.setState({ mouseLoc: mouseLoc });
                  }
                  if (err) return console.error(err);
                }
              );
              if (err) return console.error(err);
            }
          );
        } else {
          console.log(activeWin)
        }
      });
    
  }

  componentWillUnmount() {
    clearInterval(this.trackInterval);
  }

  render() {
    const {prevApp} = this.state
    if (prevApp)
      return (
        <div>
          <div
            className="background"
          >
          </div>
          <div style={{marginTop: '30%', marginLeft: 75}}>
            <ViewedApp data={prevApp} />
          </div>
        </div>
      );

    return (
      <>
      <div
          className="background"
      />

      </>
    );

  }
}

export default Tracker;
