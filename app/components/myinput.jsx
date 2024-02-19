import React from "react";
import { Text, TextInput, View } from "react-native";

export default function MyInput({ label, value, setValue }) {

  return (
    <View style={{ marginVertical: 5 }}>
      {label && <Text>{label}</Text>}
      <TextInput value={value} onChangeText={t => setValue(t)} style={
        {
          height: 46,
          fontSize: 18,
          width: '100%',
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'silver',
          padding: 10,
        }
      } />
    </View>
  )

}