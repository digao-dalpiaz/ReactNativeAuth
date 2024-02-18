import { expo } from "../app.json";

export const APP_VERSION = expo.version;

// eslint-disable-next-line no-undef
export const AUTH_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH_CLIENT_ID;
// eslint-disable-next-line no-undef
export const AUTH_URL = process.env.EXPO_PUBLIC_AUTH_URL;
// eslint-disable-next-line no-undef
export const URL_BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL
