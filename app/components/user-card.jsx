import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function UserCard({ auth }) {

  return (
    <View style={{ margin: 10, backgroundColor: '#FAD38B', padding: 10, alignItems: 'center', borderRadius: 5 }}>
      <AntDesign name="user" size={36} color="#976200" />
      <Text>{auth.profile.name}</Text>
      <Text>{auth.profile.email}</Text>
    </View>
  )

}