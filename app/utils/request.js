import axios from "axios";
import { APP_VERSION, URL_BACKEND } from "./constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { toastError } from "./toast-cfg";

export const request = axios.create({
  baseURL: URL_BACKEND,
  headers: {
    appVersion: APP_VERSION,
    osVersion: Platform.constants['Release']
  }
});

export function useAxiosInterceptor(auth) {

  let semaphore = 0;

  const [doing, setDoing] = useState(false);

  function register() {
    request.interceptors.request.use(async r => {
      initRequest();
      try {
        const loginInfo = await auth.checkRefresh(); //check if we need to renew token
        r.headers.Authorization = 'Bearer ' + loginInfo.tokenData.accessToken;
      } catch (error) {
        throw new axios.Cancel('Auth refresh error: ' + error.message);
      }
      return r;
    }, error => {
      toastError('Request Error', error.message);
      return Promise.reject(error);
    })
    request.interceptors.response.use(r => {
      endRequest();
      return r;
    }, error => {
      endRequest();
      handleError(error);
      return Promise.reject(error);
    })
  }

  function initRequest() {
    if (semaphore === 0) setDoing(true);
    semaphore++;
  }

  function endRequest() {
    semaphore--;
    if (semaphore === 0) setDoing(false);
  }

  function handleError(error) {
    let msg;
    if (error.response) {
      switch (error.response.status) {
        case 422:
          msg = error.response.data;
          break;
        case 500:
          msg = 'Internal server error';
          break;
        case 401:
          msg = 'Unauthorized'; //invalid auth
          break;
        case 403:
          msg = 'Forbidden'; //invalid role
          break;
        default:
          msg = 'Error ' + error.response.status;
      }
    } else {
      msg = error.message;
      if (error.code === 'ERR_NETWORK') msg = 'Error connecting to server';
    }
    msg = msg.trim();
    toastError(msg);
  }

  useEffect(() => {
    register();
  }, [])

  return { doing }

}