import React, { Component } from "react";
import { Switch, Redirect } from "react-router-dom";
import SearchForm from "../comps/SearchForm.js";
require("./Main.css");
class Main extends Component {
  render() {
    return (
      <div>
        <div className="main-text">
          <span className="main-text-span">Main page</span>
        </div>
        <SearchForm />
      </div>
    );
  }
}
export default Main;
