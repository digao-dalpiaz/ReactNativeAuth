import React from "react";
import { Text } from "react-native";
import MyButton from "../components/mybutton";
import { api } from "../utils/request";
import { toastInfo } from "../utils/toast-cfg";
import Page from "../components/page";

export default function Home() {

  return (
    <Page>
      <Text>Welcome to Home Page</Text>
      <Text>Here are some backend tests:</Text>
      <MyButton title="Get Info" onPress={getInfo} />
      <MyButton title="Get Info (only Prof role)" onPress={getInfoOnlyProf} />
      <MyButton title="Test Error" onPress={testError} />
      <MyButton title="Test Validation" onPress={testValidation} />
      <MyButton title="Invalid Endpoint" onPress={invalidEndpoint} />
    </Page>
  )

  function getInfo() {
    api('GET', '/Test/GetInfo', null, data => {
      toastInfo(data);
    })
  }

  function getInfoOnlyProf() {
    api('GET', '/Test/GetInfoOnlyProf', null, data => {
      toastInfo(data);
    })
  }

  function testError() {
    api('POST', '/Test/TestError', null, data => {
      toastInfo(data);
    })
  }

  function testValidation() {
    api('POST', '/Test/TestValidation', null, data => {
      toastInfo(data);
    })
  }

  function invalidEndpoint() {
    api('POST', '/Test/InvalidEndpoint', null, data => {
      toastInfo(data);
    })
  }

}