import React, { Component } from "react";
import axios from "axios";
import hostName from "../config.js";

require("./Controls.css");
class Controls extends Component {
  constructor(props) {
    super(props);
    var currcomp = 0;
    this.state = { user: "", tick: 0, currcomp: "currcomp" };
    var currcomp = <div>{this.state.tick}</div>;
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }
  submit(e) {
    this.props.load();
    var startdate = 0;
    var enddate;
    if (e.target[1].value) {
      startdate = Math.round(e.target[1].valueAsNumber / 1000);
    }
    if (e.target[2].value) {
      enddate = Math.round(e.target[2].valueAsNumber / 1000);
    } else enddate = Math.round(new Date().getTime() / 1000);
    axios
      .get(hostName + "query_scrobbles.php", {
        params: {
          user: this.props.user,
          startdate: startdate,
          enddate: enddate,
          code: e.target[0].value
        }
      })
      .then(response => {
        if (this._ismounted) {
          if (response.data.length > 0) this.props.dataCallback(response.data);
          else this.props.nodata();
        }
      })
      .catch(error => {
        if (this._ismounted) {
          this.props.dataCallback(false);
        }
      });
    e.preventDefault();
  }
  render() {
    return (
      <form className="qform controls-grid" onSubmit={this.submit}>
        <div>Тип запроса</div>
        <div>От</div>
        <div>До</div>
        <div>
          <select id="query" name="query" className="controls-input">
            <option value="1">Artist</option>
            <option value="2">Album</option>
            <option value="3">Track</option>
          </select>
        </div>
        <div>
          <input type="date" id="begin" className="controls-input" />
        </div>
        <div>
          <input type="date" id="end" className="controls-input" />
        </div>
        <button className="controls-button">Запросить</button>
      </form>
    );
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ user: this.props.user });
  }
}
export default Controls;
