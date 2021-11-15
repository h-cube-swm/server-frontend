import { useEffect, useRef } from "react";
import { useGlobalState } from "contexts/GlobalContext";

export default function ChannelService({ pluginKey, ...ohters }) {
  const isInit = useRef(false);
  const { isEmbed, enableChannelIO } = useGlobalState();

  useEffect(() => {
    if (isEmbed) return;
    if (!enableChannelIO) return;

    const channelIO = {
      q: [
        [
          "boot",
          {
            pluginKey,
            ...ohters,
          },
        ],
      ],
    };
    window.ChannelIO = channelIO;

    function onLoad() {
      if (isInit.current) return;
      isInit.current = true;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
      script.charset = "UTF-8";

      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    if (document.readyState === "complete") {
      onLoad();
    } else if (window.attachEvent) {
      window.attachEvent("onload", onLoad);
    } else {
      window.addEventListener("DOMContentLoaded", onLoad, false);
      window.addEventListener("load", onLoad, false);
    }
  }, []);

  return null;
}
