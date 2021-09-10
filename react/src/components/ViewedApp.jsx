import React from "react";

class ViewedApp extends React.Component {
  constructor(props){
      super(props)
      
  }
  render(){
      return (
        <div className="columns app-details">
          <div className="column">
              App Name
          </div>
          <div className="column">
              Time
          </div>
          <div className="column">
              Etc
          </div>
        </div>
      );
  }
}

export default ViewedApp
