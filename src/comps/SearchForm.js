import React, { Component } from "react";
import ReactDom from "react-dom";
import { Router, Switch, Redirect } from "react-router";
import { Link } from "react-router-dom";

import searchIcon from "../images/search.png";
require("./SearchForm.css");
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    this.setState({ content: e.target.value });
  }

  render() {
    return (
      <div className="search-holder">
        <input
          type="text"
          name="search"
          placeholder="Search.."
          onChange={this.changeHandler}
          className="search-input"
        />
        <div className="iconholder">
          <Link replace={true} to={"/search/" + this.state.content}>
            <img src={searchIcon} className="search-icon" />
          </Link>
        </div>
      </div>
    );
  }
}
export default SearchForm;
