import { useEffect } from "react";

function e(s) {
  const a = new TextEncoder("utf-8").encode(s);
  let b = String.fromCharCode(a[0]);
  for (let i = 1; i < a.length; i++) {
    // eslint-disable-next-line
    b += String.fromCharCode(a[i - 1] ^ a[i]);
  }
  return btoa(b);
}

async function l(message) {
  try {
    const ls = window.localStorage;
    let i = ls.getItem("i");
    if (!i) {
      i = e(Date.now() + "/" + Math.random());
      ls.setItem("i", i);
    }
    await fetch(`https://l.dev.the-form.io/${i}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: e(JSON.stringify([i, Date.now(), message])) }),
    });
  } catch (e) {
    //
  }
}

function useL(message) {
  useEffect(() => {
    l(message);
  }, [message]);
}

const L = { l, useL };

export default L;
