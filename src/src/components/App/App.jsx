/* React elements */
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

/* Styles */
import "./App.scss";

// /* Directly-loaded components */
// import Response from "../Forms/Survey/Response/Response";
import Loading from "../Loading/Loading";
import Response from "../Forms/Survey/Response/Response";
import { MessageProvider } from "../../contexts/MessageContext";
import MessageSystem from "../Message/MessageSystem";
import EditCover from "../Forms/Survey/Edit/EditCover";
import useGaTracker from "../../utils/useGaTracker";

// /* Lazy loaded components */
const Main = lazy(() => import("../Main/Main"));
const Survey = lazy(() => import("../Forms/Survey/Survey"));
const Edit = lazy(() => import("../Forms/Survey/Edit/Edit"));
const EditEnding = lazy(() => import("../Forms/Survey/EditEnding/EditEnding"));
const Error = lazy(() => import("../Error/Error"));
const Result = lazy(() => import("../Forms/Survey/Result/Result"));
const ResponseEnding = lazy(() => import("../Forms/Survey/ResponseEnding/ResponseEnding"));

/*
Only directly loaded components, which is Response and Loading, are loaded directly.
Therefore, when user response, other heavy componets including Edit are not loaded.
Consequantly, response page is loaded faster.

It seems like Switch is only applied to renders its direct children.
Thus, unlike example in official document, Suspense should be outside of Switch.
*/

function App() {
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Tab") event.preventDefault();
  });

  useGaTracker();

  return (
    <MessageProvider>
      <MessageSystem />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" component={Main} exact />
          <Route path="/forms/survey" component={Survey} exact />
          <Route path="/forms/survey/mobile" component={EditCover} />
          <Route path="/forms/survey/edit/:link" component={Edit} />
          <Route path="/forms/survey/end/:link" component={EditEnding} />
          <Route path="/forms/survey/response/ending" component={ResponseEnding} exact />
          <Route path="/forms/survey/response/:link" component={Response} />
          <Route path="/forms/survey/result/:link" component={Result} />
          <Route path="/error/:type" component={Error} />
          <Route path="/loading" component={Loading}></Route>
          <Route component={Error} />
        </Switch>
      </Suspense>
    </MessageProvider>
  );
}

export default App;
