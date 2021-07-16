import axios from "axios";

const ROOT = "https://api.h-cu.be";

export async function getApi(path) {
  try {
    const { data } = await axios({
      url: ROOT + path,
      method: "GET",
    });
    return data;
  } catch (e) {
    // console.log(e);
    return null;
  }
}

export async function postApi(path, body) {
  try {
    const { data } = await axios({
      url: ROOT + path,
      method: "POST",
      data: body,
    });
    return data;
  } catch (e) {
    // console.log(e);
    return null;
  }
}

export async function putApi(path, body) {
  try {
    const { data } = await axios({
      url: ROOT + path,
      method: "PUT",
      data: body,
    });
    return data;
  } catch (e) {
    // console.log(e);
    return null;
  }
}
