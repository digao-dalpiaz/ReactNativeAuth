import React from "react";
import { Linking, Text } from "react-native";
import Page from "../components/page";

export default function About() {

  return (
    <Page>
      <Text style={{ fontSize: 20 }}>This app demonstrates how to implement OAuth2 authentication and communicate with backend.</Text>
      <Text />
      <Text>Developed by Digao Dalpiaz</Text>
      <Text onPress={gotoSite} style={{ color: 'blue', fontSize: 20 }}>GitHub</Text>
    </Page>
  )

  function gotoSite() {
    Linking.openURL('https://github.com/digao-dalpiaz');
  }

}