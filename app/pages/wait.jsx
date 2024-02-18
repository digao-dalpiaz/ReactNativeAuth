import React from "react";
import { Image, View } from "react-native";
import Image_loading from "../assets/loading.gif";

export default function Wait() {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={Image_loading} style={{ height: 100, width: 100 }} />
    </View>
  )
}