import React, { Component } from "react";
import ReactDom from "react-dom";
import { Switch } from "react-router";
import statIcon from "../images/graph.png";
import noimage from "../images/no_image.jpg";
import downloadIcon from "../images/download.png";
import { Link } from "react-router-dom";
require("./User.css");
require("../pages/Common.css");
class User extends Component {
  notLoadedUser() {
    return <div>not loaded</div>;
  }
  loadedUser() {
    return (
      <div className="user-panel">
        <img
          src={this.props.user.url.length > 0 ? this.props.user.url : noimage}
          className="user-pic"
        />
        <p>{this.props.user.name}</p>
        <br />
        {this.props.showStatLink ? (
          <div className="iconholder">
            <Link replace={true} to={"/user/" + this.props.user.name}>
              <img src={statIcon} className="user-icon" />
            </Link>
          </div>
        ) : null}
        {this.props.showDownloadLink ? (
          <div className="iconholder">
            <Link replace={true} to={"/download/" + this.props.user.name}>
              <img
                src={downloadIcon}
                className="user-icon"
                onClick={this.redirectDownload}
              />
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.user.url == "#" ? this.notLoadedUser() : this.loadedUser()}
      </div>
    );
  }
}
export default User;
