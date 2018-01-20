import React from "react";
import ReactDOM from "react-dom";

import { HashRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import UserPage from "./pages/UserPage.js";
import Main from "./pages/Main.js";
import Search from "./pages/Search.js";
import Download from "./pages/Download.js";

ReactDOM.render(
  <div>
    <HashRouter>
      <Switch>
        <Route exact path="/search/:user" component={Search} />
        <Route exact path="/search/" component={Search} />
        <Route exact path="/user/:user" component={UserPage} />
        <Route exact path="/" component={Main} />
        <Route exact path="/download/:user" component={Download} />
      </Switch>
    </HashRouter>
  </div>,
  document.getElementById("root")
);
