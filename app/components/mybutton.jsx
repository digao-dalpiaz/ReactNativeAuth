import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const btnStyle = {
  alignItems: 'center', //align horizontally
  justifyContent: 'center', //align vertically
  paddingVertical: 8,
  paddingHorizontal: 28,
  borderRadius: 4,
  elevation: 3,
  minHeight: 46
}

const textStyle = {
  fontSize: 15,
  fontWeight: 'bold',
  color: 'white'
}

export default function MyButton(props) {
  return (
    <TouchableOpacity disabled={props.disabled}
      style={{
        ...btnStyle,
        backgroundColor: props.disabled ? 'gray' : 'black',
        ...props.style
      }}
      onPress={props.onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' /* align items inside row vertically */ }}>
        {props.icon && <AntDesign name={props.icon} size={24} color="white" />}
        {(props.icon && props.title) && <View style={{ marginLeft: 10 }} />}
        <Text style={textStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  )
}