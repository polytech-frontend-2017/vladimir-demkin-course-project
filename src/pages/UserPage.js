import React, { Component } from "react";
import axios from "axios";
import Visualiser from "../comps/Visualiser.js";
import Controls from "../comps/Controls.js";
import User from "../comps/User.js";
import SearchForm from "../comps/SearchForm.js";
import hostName from "../config.js";
require("./UserPage.css");
require("./Common.css");
class UserPage extends Component {
  constructor(props) {
    super(props);
    this.loadedComp = this.loadedComp.bind(this);
    this.loadingComp = this.loadingComp.bind(this);
    this.errorComp = this.errorComp.bind(this);
    this.state = {
      dataSet: [],
      currComp: this.defaultComp,
      user: { name: "", url: "#" },
      userFound: false
    };
    axios
      .get(hostName + "query_user.php", {
        params: {
          user: this.props.match.params.user
        }
      })
      .then(response => {
        if (this._ismounted) {
          if (response.data.length > 0)
            this.setState({
              user: {
                name: response.data[0].username,
                url: response.data[0].image
              },
              userFound: true
            });
          else
            this.setState({
              currComp: this.userNotFoundComp,
              userFound: false
            });
        }
      })
      .catch(error => {
        if (this._ismounted)
          this.setState({ currComp: this.errorComp, userFound: false });
      });
  }
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }
  dataToPageCallback(data) {
    if (data) {
      this.setState({ dataSet: data });
      this.setState({ currComp: this.loadedComp });
    } else this.setState({ currComp: this.errorComp });
  }
  startLoadingCallback() {
    this.setState({ currComp: this.loadingComp });
  }
  noDataCallback() {
    this.setState({ currComp: this.noDataComp });
  }
  defaultComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">Запросите данные</span>
      </div>
    );
  }

  noDataComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">
          Нет данных для указанного периода
        </span>
      </div>
    );
  }
  loadedComp() {
    return (
      <div>
        <Visualiser dataSet={this.state.dataSet} />
      </div>
    );
  }
  loadingComp() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">Идет загрузка</span>
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

  render() {
    return (
      <div>
        <SearchForm />
        <div className="content">
          <div className="userpage-userpanel">
            <div className="userpage-userholder">
              <User
                user={this.state.user}
                showDownloadLink={true}
                showStatLink={false}
              />
            </div>
            {this.state.userFound ? (
              <Controls
                user={this.props.match.params.user}
                dataCallback={this.dataToPageCallback.bind(this)}
                load={this.startLoadingCallback.bind(this)}
                nodata={this.noDataCallback.bind(this)}
              />
            ) : null}
          </div>
          {this.state.currComp()}
        </div>
      </div>
    );
  }
}
export default UserPage;
