import React from "react";
import { Text, View } from "react-native";
import MyButton from "../components/mybutton";

export default function Login({ auth }) {

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <View style={{ marginHorizontal: 30, padding: 10, backgroundColor: '#61E1EE', borderRadius: 10, elevation: 5 }}>
        <Text style={{ fontSize: 80, alignSelf: 'center' }}>Hello!</Text>
        <Text style={{ fontSize: 20, alignSelf: 'center' }}>Let&apos;s start?</Text>
        <MyButton style={{ marginVertical: 20 }} icon="login" title="Login" onPress={() => auth.login()} />
      </View>
    </View>
  )

}