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

export default function MyButton({disabled, style, icon, title, onPress}) {
  return (
    <TouchableOpacity disabled={disabled}
      style={{
        ...btnStyle,
        backgroundColor: disabled ? 'gray' : 'black',
        ...style
      }}
      onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' /* align items inside row vertically */ }}>
        {icon && <AntDesign name={icon} size={24} color="white" />}
        {(icon && title) && <View style={{ marginLeft: 10 }} />}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}