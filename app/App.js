import React from "react";
import { StatusBar } from 'expo-status-bar';
import Toast from "react-native-toast-message";
import { toastConfig } from "./utils/toast-cfg";
import Global from "./pages/global";

export default function App() {

  return (
    <>
      <StatusBar style='inverted' translucent={false} />
      <Global />
      <Toast config={toastConfig} />
    </>
  )

}