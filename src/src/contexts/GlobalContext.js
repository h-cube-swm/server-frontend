import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalStateProvider({ children }) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const [embedState, setEmbedState] = useState(false);
  const isEmbed = (params.embed && true) || embedState;

  // If isEmbed is set once, then it will be set forever.
  useEffect(() => {
    setEmbedState(isEmbed);
  }, [isEmbed]);

  return <GlobalContext.Provider value={{ isEmbed }}>{children}</GlobalContext.Provider>;
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  return context;
}
