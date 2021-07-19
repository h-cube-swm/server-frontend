/* React elements */
import React from "react";
import { Route, Link, Switch } from "react-router-dom";

/* Styles */
import "./App.css";

/* Components */
import Main from "../Main/Main";
import Survey from "../Forms/Survey/Survey";
import Edit from "../Forms/Survey/Edit";
import Ending from "../Forms/Survey/Ending";

import Test from "../test";

function App() {
  return (
    <div>
      <Test />
      <Switch>
        <Route path="/" component={Main} exact />
        <Route path="/forms/survey" component={Survey} exact />
        <Route path="/forms/survey/edit/:link" component={Edit} />
        <Route path="/forms/survey/end/:link" component={Ending} />
        <Route
          render={({ location }) => (
            <div>
              <h1>Routing Error!</h1>
            </div>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
