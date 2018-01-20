import React, { Component } from "react";
import { Switch, Redirect, Link } from "react-router-dom";
import User from "../comps/User.js";
import axios from "axios";
import SearchForm from "../comps/SearchForm.js";
import hostName from "../config.js";

require("./Common.css");
require("./Search.css");
class NoMatch extends Component {
  render() {
    return (
      <div className="messagebox">
        <span className="messagebox-span">
          Страница не найдена<br />
          <Link to="/"> На главную</Link>
        </span>
      </div>
    );
  }
}

export default NoMatch;
