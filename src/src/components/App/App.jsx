/* React elements */
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

/* Styles */
import "./App.scss";

// /* Directly-loaded components */
// import Response from "../Forms/Survey/Response/Response";
import Loading from "../Loading/Loading";
import ResponseContainer from "../Forms/Survey/Response/Response";
import { MessageProvider } from "../../contexts/MessageContext";
import { ModalProvider } from "../../contexts/ModalContext";
import ModalSystem from "../Modal/ModalSystem";
import MessageSystem from "../Message/MessageSystem";
import EditCover from "../Forms/Survey/Edit/EditCover";
import useGaTracker from "../../utils/useGaTracker";
import { GlobalStateProvider } from "../../contexts/GlobalContext";
import ChannelService from "../ChannelService/ChannelService";
import Admin from "../Admin/Admin";
import Viewer from "../Admin/Viewer/Viewer";
import StartTime from "../Forms/Survey/StartTime/StartTime";
import L from "../../utils/logger";

// /* Lazy loaded components */
const Main = lazy(() => import("../Main/Main"));
const MyPage = lazy(() => import("../MyPage/MyPage"));
const Pricing = lazy(() => import("../Pricing/Pricing"));
const Survey = lazy(() => import("../Forms/Survey/Survey"));
const Edit = lazy(() => import("../Forms/Survey/Edit/Edit"));
const EditEnding = lazy(() => import("../Forms/Survey/EditEnding/EditEnding"));
const NotFound = lazy(() => import("../Error/NotFound"));
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
  L.useL(`Init:${localStorage.token}`);
  useGaTracker();

  return (
    <>
      <GlobalStateProvider>
        <ModalProvider>
          <MessageProvider>
            <ModalSystem />
            <MessageSystem />
            <Suspense fallback={<Loading />}>
              <Switch>
                <Route path="/" component={Main} exact />
                <Route path="/mypage" component={MyPage} exact />
                <Route path="/pricing" component={Pricing} exact />
                <Route path="/forms/survey" component={Survey} exact />
                <Route path="/forms/survey/mobile" component={EditCover} />
                <Route path="/forms/survey/edit/:link" component={Edit} />
                <Route path="/forms/survey/end/:link" component={EditEnding} />
                <Route path="/forms/survey/response/ending" component={ResponseEnding} exact />
                <Route path="/forms/survey/response/:link" component={ResponseContainer} />
                <Route path="/forms/survey/result/:link" component={Result} />
                <Route path="/loading" component={Loading}></Route>
                <Route path="/start/:link" component={StartTime}></Route>

                {/* Admin-page related pathes */}
                <Route path="/admin/view/:id" component={Viewer}></Route>
                <Route path="/admin" component={Admin}></Route>
                <Route component={NotFound} />
              </Switch>
            </Suspense>
            <ChannelService pluginKey="91cb6c42-6533-4d7a-b925-f223dde1fe16" />
          </MessageProvider>
        </ModalProvider>
      </GlobalStateProvider>
    </>
  );
}

export default App;
