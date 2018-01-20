import React, { Component } from "react";
import axios from "axios";
import Visualiser from "../comps/Visualiser.js";
import User from "../comps/User.js";
import SearchForm from "../comps/SearchForm.js";
import startIcon from "../images/start.png";
import stopIcon from "../images/pause.png";
import hostName from "../config.js";
require("./UserPage.css");
require("./Download.css");
require("./Common.css");
class Download extends Component {
  constructor(props) {
    super(props);
    this.loadedComp = this.loadedComp.bind(this);
    this.loadingComp = this.loadingComp.bind(this);
    this.errorComp = this.errorComp.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.load = this.load.bind(this);
    this.state = {
      dataSet: [],
      currComp: this.defaultComp,
      user: { name: "", url: "#" },
      stop: true,
      max: 0,
      value: 0,
      userFound: false
    };
    axios
      .get(hostName + "query_user.php", {
        params: {
          user: this.props.match.params.user
        }
      })
      .then(response => {
        if (response.data.length > 0)
          this.setState({
            user: {
              name: response.data[0].username,
              url: response.data[0].image
            },
            userFound: true
          });
        else
          this.setState({ currComp: this.userNotFoundComp, userFound: false });
      })
      .catch(error => {
        this.setState({ currComp: this.errorComp, userFound: false });
      });
  }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }
  defaultComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">Начните загрузку</span>
      </div>
    );
  }

  loadingComp() {
    return (
      <div className="download-pbar-holder">
        <div>
          {this.state.max > 0 ? this.state.value + "/" + this.state.max : ""}
        </div>
        {this.state.max > 0 ? (
          <progress
            max={this.state.max}
            value={this.state.value}
            className="download-pbar"
          />
        ) : (
          <progress className="download-pbar" />
        )}
      </div>
    );
  }
  loadedComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">Загрузка завершена</span>
      </div>
    );
  }
  errorComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">Проблемы с соединением</span>
      </div>
    );
  }
  apiDownComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">
          Проблемы с соединением c api lastfm
        </span>
      </div>
    );
  }
  userNotFoundComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">
          Пользователь не найден<br />
          Воспользуйтесь поиском
        </span>
      </div>
    );
  }
  startLoading() {
    this.setState({ stop: false });
    this.load();
  }
  load() {
    this.setState({ currComp: this.loadingComp });
    axios
      .get(hostName + "download_scrobbles.php", {
        params: {
          user: this.props.match.params.user
        }
      })
      .then(response => {
        if (this._ismounted) {
          if (response.data.hasOwnProperty("max")) {
            this.setState({
              max: response.data["max"],
              value: response.data["curr"]
            });
          } else this.setState({ currComp: this.apiDownComp, stop: true });
          if (!this.state.stop) {
            if (parseInt(this.state.max) > parseInt(this.state.value))
              setTimeout(this.load, 250);
            else this.setState({ stop: true, currComp: this.loadedComp });
          }
        }
      })
      .catch(error => {
        if (this._ismounted) {
          this.setState({ stop: true, currComp: this.errorComp });
        }
      });
  }
  stopLoading() {
    this.setState({ stop: true, currComp: this.defaultComp });
  }
  render() {
    return (
      <div>
        <SearchForm />
        <div className="content">
          <div className="userpage-userpanel">
            <div className="userpage-userholder">
              <User
                user={this.state.user}
                showDownloadLink={false}
                showStatLink={true}
              />
            </div>
            {this.state.userFound ? (
              <div className="big-icon-holder">
                {this.state.stop ? (
                  <div role="button" tabIndex="0">
                    {" "}
                    <img
                      src={startIcon}
                      className="big-icon"
                      onClick={this.startLoading}
                    />
                  </div>
                ) : (
                  <div role="button" tabIndex="0">
                    <img
                      src={stopIcon}
                      className="big-icon"
                      onClick={this.stopLoading}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {this.state.currComp()}
        </div>
      </div>
    );
  }
}
export default Download;
