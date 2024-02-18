import React from "react";
import { Text, View } from "react-native";
import MyButton from "../components/mybutton";
import { request } from "../utils/request";
import { toastInfo } from "../utils/toast-cfg";

export default function Home() {

  return (
    <View style={{ padding: 10 }}>
      <Text />
      <Text>Welcome to Home Page</Text>
      <Text />
      <Text />
      <MyButton title="Send backend request" onPress={sendBackendRequest} />
    </View>
  )

  function sendBackendRequest() {
    request.get('/Test/GetInfo').then(response => {
      toastInfo(response.data);
    })
  }

}