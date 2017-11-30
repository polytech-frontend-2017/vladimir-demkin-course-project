import React from "react";
import ReactDOM from "react-dom";

import { HashRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import UserPage from "./UserPage.js";
import Main from "./Main.js";
import Search from "./Search.js";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path="/search/:user" component={Search} />
      <Route exact path="/user/:user" component={UserPage} />
      <Route exact path="/" component={Main} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
