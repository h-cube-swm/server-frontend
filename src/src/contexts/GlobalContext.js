import React, { createContext, useContext, useEffect, useState } from "react";

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
  const params = getParams();
  const cookies = getCookies();

  const [embedState, setEmbedState] = useState(cookies.token);
  const isEmbed = (params.embed && true) || embedState;

  // It token is in cookie, store the token into local storage and remove token in cookie.
  if (cookies.token) {
    localStorage.token = cookies.token;
    document.cookie = "token=; Max-Age=0; domain=the-form.io";
  }

  // Get token from local storage.
  const { token } = localStorage;

  // If isEmbed is set once, then it would be set forever.
  useEffect(() => setEmbedState(isEmbed), [isEmbed]);

  return (
    <GlobalContext.Provider value={{ isEmbed, token, logout }}>{children}</GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  return context;
}
