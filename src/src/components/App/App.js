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
import Response from "../Forms/Survey/Response/Response";
import Error from "../Error/Error";
import Result from "../Forms/Survey/Result/Result";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Main} exact />
        <Route path="/forms/survey" component={Survey} exact />
        <Route path="/forms/survey/edit/:link" component={Edit} />
        <Route path="/forms/survey/end/:link" component={Ending} />
        <Route path="/forms/survey/response/:link" component={Response} />
        <Route path="/forms/survey/result/:link" component={Result} />
        <Route path="/error/:type" component={Error} />
        <Route component={Error} />
      </Switch>
    </>
  );
}

export default App;
