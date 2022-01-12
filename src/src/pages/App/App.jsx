// React elements
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

// Styles
import "./App.scss";

// Pages
import Loading from "pages/Loading/Loading";
import ResponseContainer from "pages/Response/Response";
import EditCover from "pages/EditCover/EditCover";
import Admin from "pages/Admin/Admin";
import Viewer from "pages/Admin/Viewer/Viewer";
import StartTime from "pages/StartTime/StartTime";

// Contexts
import { MessageProvider } from "contexts/MessageContext";
import { ModalProvider } from "contexts/ModalContext";
import { GlobalStateProvider } from "contexts/GlobalContext";

// Components
import ModalSystem from "components/Modal/ModalSystem";
import MessageSystem from "components/Message/MessageSystem";
import ChannelService from "components/ChannelService/ChannelService";

// Utils
import L from "utils/logger";
import useGaTracker from "utils/useGaTracker";

// Lazy loaded pages
const Main = lazy(() => import("pages/Main/Main"));
const MyPage = lazy(() => import("pages/MyPage/MyPage"));
const Pricing = lazy(() => import("pages/Pricing/Pricing"));
const Survey = lazy(() => import("pages/Survey"));
const Edit = lazy(() => import("pages/Edit/Edit"));
const SurveyDetails = lazy(() => import("pages/SurveyDetails/SurveyDetails"));
const NotFound = lazy(() => import("pages/Error/NotFound"));
const Result = lazy(() => import("pages/Result/Result"));
const ResponseEnding = lazy(() => import("pages/ResponseEnding/ResponseEnding"));
const DrawCheck = lazy(() => import("pages/DrawCheck/DrawCheck"));

/*
Only direct-loading required components, which is `Response` and `Loading`, are loaded directly.
Other components are not loaded when frontend started.
Therefore, when user response, other heavy componets including Edit are not loaded.
Consequantly, response page is loaded faster.
---
It seems like `Switch` is only applied to renders its direct children.
Thus, unlike example in official document, `Suspense` should be outside of `Switch`.
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
                <Route path="/forms/survey/details/:link" component={SurveyDetails} />
                <Route path="/forms/survey/response/ending" component={ResponseEnding} exact />
                <Route path="/forms/survey/response/:link" component={ResponseContainer} />
                <Route path="/forms/survey/result/:link" component={Result} />
                <Route path="/forms/survey/draw/:link" component={DrawCheck} />
                <Route path="/loading" component={Loading}></Route>
                <Route path="/start/:link" component={StartTime}></Route>

                {/* Admin-page related pathes */}
                <Route path="/admin/view/:id" component={Viewer}></Route>
                <Route path="/admin" component={Admin}></Route>

                {/* 404 Handling */}
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
