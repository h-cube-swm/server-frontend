import React, { createContext, useContext, useEffect, useState } from "react";
import L from "../utils/logger";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

function getCookies() {
  const cookies = document.cookie.split(";").map((x) => x.trim().split("="));
  return Object.fromEntries(cookies);
}

function logout() {
  localStorage.token = "";
}

const GlobalContext = createContext();

export function GlobalStateProvider({ children }) {
  const location = window.location.href;
  const params = getParams();
  const cookies = getCookies();

  const [embedState, setEmbedState] = useState(cookies.token);
  const enableChannelIO = !(location.indexOf("/response/") >= 0 || location.indexOf("/admin") >= 0);

  const isEmbed = (params.embed && true) || embedState;

  // It token is in cookie, store the token into local storage and remove token in cookie.
  if (cookies.token) {
    localStorage.token = cookies.token;
    document.cookie = "token=; Max-Age=0; domain=the-form.io";
    L.l(`Login:${localStorage.token}`);
  }

  // Get token from local storage.
  const { token } = localStorage;

  // If isEmbed is set once, then it would be set forever.
  useEffect(() => setEmbedState(isEmbed), [isEmbed]);

  return (
    <GlobalContext.Provider value={{ isEmbed, token, logout, enableChannelIO, params }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  return context;
}
