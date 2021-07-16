import React from "react";
import { putApi } from "../utils/parser";

const Test = () => {
  const onClick = async () => {
    try {
      const response = await putApi(
        "/surveys/850e0460-46d5-4695-a0a0-d430d8439116/",
        JSON.stringify({
          title: "wooogy",
          description: "ba-bo",
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  return <button onClick={onClick}>test</button>;
};

export default Test;
