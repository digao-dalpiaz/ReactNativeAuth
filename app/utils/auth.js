import { TokenResponse, exchangeCodeAsync, fetchUserInfoAsync, loadAsync, makeRedirectUri } from "expo-auth-session";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import { openAuthSessionAsync } from "expo-web-browser";
import * as SecureStore from 'expo-secure-store';
import { AUTH_CLIENT_ID, AUTH_URL } from "./constants";
import { toastError } from "./toast-cfg";

class DismissError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
  }
}

export default function useAuth(checkForRefreshWhenInit) {

  const [profile, setProfile] = useState(false); //profile contains user data and when not null means user logged in
  const [processing, setProcessing] = useState(true); //start waiting to avoid flickering

  const discovery = {
    authorizationEndpoint: AUTH_URL + '/oauth2/authorize',
    tokenEndpoint: AUTH_URL + '/oauth2/token',
    userInfoEndpoint: AUTH_URL + '/oauth2/userinfo',
    endSessionEndpoint: AUTH_URL + '/oauth2/logout',
  };

  const redirectUri = makeRedirectUri({
    scheme: Constants.expoConfig.scheme,
    path: 'redirect',
  });

  //--LOGIN AND LOGOUT

  async function execLogin() {
    const authRequest = await loadAsync({
      clientId: AUTH_CLIENT_ID,
      scopes: ['openid', 'offline_access'],
      usePKCE: true,
      redirectUri,
    }, discovery);

    let response;
    try {
      response = await authRequest.promptAsync();
    } catch (error) {
      throw new Error('Error requesting login: ' + error.message);
    }

    validateResponse(response);

    let tokenData;
    try {
      tokenData = await exchangeCodeAsync({
        clientId: AUTH_CLIENT_ID,
        code: response.params.code,
        extraParams: {
          code_verifier: authRequest.codeVerifier,
        },
        redirectUri,
      }, discovery)
    } catch (error) {
      throw new Error('Error getting token: ' + error.message);
    }

    await receivedTokenData(tokenData);
  }

  async function execLogout() {
    const params = new URLSearchParams({
      client_id: AUTH_CLIENT_ID,
      post_logout_redirect_uri: redirectUri,
    });

    let response;
    try {
      response = await openAuthSessionAsync(discovery.endSessionEndpoint + '?' + params.toString(), redirectUri)
    } catch (error) {
      throw new Error('Error requesting logout: ' + error.message);
    }

    validateResponse(response);

    await saveLoginInfo(null);
  }

  function validateResponse(response) {
    if (response.type === 'success') return; //return ok
    if (response.type === 'dismiss') throw new DismissError(); //user manually closed web page

    throw new Error('Response error: ' + response);
  }

  //--TOKEN INFO BUILDER

  async function receivedTokenData(tokenData) {
    let userData;
    try {
      userData = await fetchUserInfoAsync(tokenData, discovery);
    } catch (error) {
      throw new Error('Error getting user data: ' + error.message);
    }

    const info = {
      tokenData: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: tokenData.expiresIn,
        issuedAt: tokenData.issuedAt
      },
      userData: {
        email: userData.email,
        name: userData.name, //given_name + ' ' + userData.family_name
        roles: userData.roles
      }
    };

    await saveLoginInfo(info);

    return info;
  }

  //--INITIAL CHECK LOGIN

  async function checkStoredLogin() {
    const info = await loadLoginInfo();
    if (!info) {
      log('No login stored');
      return;
    }

    log('Login previously stored');

    if (checkForRefreshWhenInit) {
      log('Check if we need to refresh');
      if (await checkRefresCustomData(info.tokenData)) return; //saveLoginInfo will occur inside method
    }

    await saveLoginInfo(info, true); //only set state
  }

  //--REFRESH TOKEN

  async function checkRefresh(implictToken) {
    const loginInfo = await loadLoginInfo();
    if (!loginInfo) throw new Error('No login info while checking for refresh token');

    const newLoginInfo = await checkRefresCustomData(loginInfo.tokenData, implictToken); //if no need to refresh, returns null
    return newLoginInfo || loginInfo;
  }

  async function checkRefresCustomData(data, implictToken) {
    const tr = new TokenResponse(data);
    if (implictToken && implictToken !== 'CURRENT') tr.refreshToken = implictToken;
    if (!(tr.refreshToken && tr.issuedAt && tr.expiresIn)) throw new Error('Token without refresh attributes');

    if (implictToken || tr.shouldRefresh()) {
      log('Token expired, let\'s renew' + (implictToken ? ' (FORCED)' : ''));

      const config = {
        clientId: AUTH_CLIENT_ID,
      };

      let newTokenData;
      try {
        newTokenData = await tr.refreshAsync(config, discovery);
      } catch (error) {
        throw new Error('Error refreshing token: ' + error.message);
      }

      return await receivedTokenData(newTokenData);
    }

    return null;
  }

  //--STORAGE

  async function loadLoginInfo() {
    const str = await SecureStore.getItemAsync('token');
    if (!str) return null;
    return JSON.parse(str);
  }

  async function saveLoginInfo(info, bypassStore) {
    if (info !== null) {
      if (!bypassStore) {
        await SecureStore.setItemAsync('token', JSON.stringify(info));
        log('Saved stored login');
      }
      setProfile(info.userData);

      const expirationTime = new Date((info.tokenData.issuedAt + info.tokenData.expiresIn) * 1000);
      log('Expiration time: ' + expirationTime);
    } else {
      await SecureStore.deleteItemAsync('token');
      setProfile(null);

      log('Cleared stored login');
    }
  }

  //--LOG

  function log(msg) {
    console.log('AUTH: ' + msg);
  }

  //--TRIGGERS

  async function surround(name, proc) {
    if (!processing) { //if triggered by useEffect, already true
      setProcessing(true);
    }
    try {
      log('Initializing ' + name);
      await proc();
      log('Completed ' + name);
    } catch (error) {
      if (error instanceof DismissError) {
        log('Operation cancelled by user');
      } else {
        log(error);
        toastError('Auth error', error.message);
      }
    } finally {
      setProcessing(false);
    }
  }

  async function login() {
    await surround('login', execLogin);
  }

  async function logout() {
    await surround('logout', execLogout);
  }

  async function forceRenewToken(refreshToken) {
    return await checkRefresh(refreshToken);
  }

  useEffect(() => {
    surround('check stored login', checkStoredLogin);
  }, []);

  //

  return { processing, profile, login, logout, checkRefresh, forceRenewToken };

}