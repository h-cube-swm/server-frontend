/* React elements */
import React from "react";
import { Route, Switch } from "react-router-dom";

/* Styles */
import "./App.scss";

/* Components */
import Main from "../Main/Main";
import Survey from "../Forms/Survey/Survey";
import Edit from "../Forms/Survey/Edit/Edit";
import Ending from "../Forms/Survey/Ending/Ending";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
