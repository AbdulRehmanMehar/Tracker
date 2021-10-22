import React from "react";

let DefaultRendering = (props) => {
    let { RenderFileNameComponent, RenderFilePathComponent } = props;
    if (!props.processTitle) return <></>;
    return (
        <div className="card my-5">
            <header className="card-header">
                    <p className="card-header-title"><b>{props.processName}</b></p>
                    <img className="card-header-icon" src={props.processIcon} alt={props.processName}/>
            </header>
            <div className="card-content">
                <p>Window Title: {props.processTitle}</p>
                <p>Mouse Location: [x: {props.mouseLoc[0]}, y: {props.mouseLoc[1]}]</p>
                { RenderFileNameComponent }
                { RenderFilePathComponent }
            </div>
        </div>
    )
}

let RenderFileName = (props) => {
    const fileName = props.fileName;
  return (
    <>
        <p>Active Filename: { fileName }</p>
    </>
  );
};

let RenderFilePath = (props) => {
    const filePath = props.filePath;
    return (
        <>
            <p>Active Filepath: { filePath }</p>
        </>
    );
};


export default class Logger extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.fileName != '' && this.props.filePath != '') {
            return (
                <>
                    <DefaultRendering
                        processIcon={this.props.processIcon}
                        processName={this.props.processName}
                        processTitle={this.props.processTitle}
                        mouseLoc={this.props.mouseLoc}
                        RenderFileNameComponent={<RenderFileName fileName={this.props.fileName} />}
                        RenderFilePathComponent={<RenderFilePath filePath={this.props.filePath} />}
                    />
                </>
            );
        } else if (this.props.fileName != '') {
            return (
                <>
                    <DefaultRendering
                        processIcon={this.props.processIcon}
                        processName={this.props.processName}
                        processTitle={this.props.processTitle}
                        mouseLoc={this.props.mouseLoc}
                        RenderFileNameComponent={<RenderFileName fileName={this.props.fileName} />}
                        RenderFilePathComponent={<></>}
                    />
                </>
            );
        } else {
            return (
                <DefaultRendering
                        processIcon={this.props.processIcon}
                        processName={this.props.processName}
                        processTitle={this.props.processTitle}
                        mouseLoc={this.props.mouseLoc}
                        RenderFileNameComponent={<></>}
                        RenderFilePathComponent={<></>}
                    />
            );
        }

    }
}