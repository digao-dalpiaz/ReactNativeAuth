import React from "react";
import { ScrollView, View } from "react-native";

export default function Page({ children }) {

  return (
    <ScrollView>
      <View style={{ margin: 10 }}>
        {children}
      </View>
    </ScrollView>
  )

}