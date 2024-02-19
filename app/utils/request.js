import axios from "axios";
import { APP_VERSION, URL_BACKEND } from "./constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { toastError } from "./toast-cfg";

const customAxios = axios.create({
  baseURL: URL_BACKEND,
  headers: {
    appVersion: APP_VERSION,
    osVersion: Platform.constants['Release']
  }
});

let semaphore = 0;
let bridge;

export function api(method, url, data, callback) {
  initRequest();

  //check if we need to renew token
  bridge.auth.checkRefresh().then(loginInfo => {

    customAxios.request({
      method,
      url,
      data,
      headers: { Authorization: 'Bearer ' + loginInfo.tokenData.accessToken }
    }).finally(() => {
      endRequest();
    }).then(response => {
      if (callback) callback(response.data);
    }).catch(error => {
      handleError(error);
    });

  }).catch(error => {
    endRequest();
    toastError('Auth refresh error', error.message);
  });
}

function initRequest() {
  if (semaphore === 0) bridge.setDoing(true);
  semaphore++;
}

function endRequest() {
  semaphore--;
  if (semaphore === 0) bridge.setDoing(false);
}

function handleError(error) {
  let msgTitle;
  let msgDetail;
  if (error.response) {
    const code = error.response.status;
    if (code === 422) {
      msgTitle = error.response.data;
    } else {
      msgTitle = 'Server error';
      msgDetail = statusCodeToMsg(code);
    }
  } else {
    msgTitle = (error.code === 'ERR_NETWORK') ? 'Error connecting to server' : error.message;
  }
  //msg = msg.trim();
  toastError(msgTitle, msgDetail);
}

function statusCodeToMsg(code) {
  switch (code) {
    case 500: return 'Internal server error';
    case 404: return 'Not found';
    case 401: return 'Unauthorized'; //invalid auth
    case 403: return 'Forbidden'; //invalid role
    default:
      return 'Error ' + code;
  }
}

export function useAxiosInterceptor(auth) {

  const [doing, setDoing] = useState(false);

  useEffect(() => {
    bridge = {
      auth, setDoing
    }
  }, [])

  return { doing }

}