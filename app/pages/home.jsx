import React from "react";
import { Text, View } from "react-native";
import MyButton from "../components/mybutton";
import { request } from "../utils/request";
import { toastInfo } from "../utils/toast-cfg";

export default function Home() {

  return (
    <View style={{ padding: 10 }}>
      <Text>Welcome to Home Page</Text>
      <Text>Here are some backend tests:</Text>
      <Text />
      <MyButton title="Get Info" onPress={getInfo} />
      <Text />
      <MyButton title="Test Error" onPress={testError} />
      <Text />
      <MyButton title="Test Validation" onPress={testValidation} />
      <Text />
      <MyButton title="Invalid Endpoint" onPress={invalidEndpoint} />
    </View>
  )

  function getInfo() {
    request.get('/Test/GetInfo').then(response => {
      toastInfo(response.data);
    })
  }

  function testError() {
    request.post('/Test/TestError').then(response => {
      toastInfo(response.data);
    })
  }

  function testValidation() {
    request.post('/Test/TestValidation').then(response => {
      toastInfo(response.data);
    })
  }

  function invalidEndpoint() {
    request.post('/Test/InvalidEndpoint').then(response => {
      toastInfo(response.data);
    })
  }

}