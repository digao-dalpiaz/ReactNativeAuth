import React from 'react';
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const toastStyle = (color) => {
  return {
    contentContainerStyle: {

    },
    style: {
      marginTop: 25, //height before toast
      paddingVertical: 16,
      borderLeftColor: color,
      height: 'auto',
      backgroundColor: '#F8F8F8'
    },
    text1Style: {
      fontSize: 20,
      fontWeight: '400'
    },
    text2Style: {
      fontSize: 16,
      fontWeight: '400'
    },
    text1NumberOfLines: 0,
    text2NumberOfLines: 0
  }
}

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      {...toastStyle('lime')}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      {...toastStyle('tomato')}
    />
  ),
};

export function toastInfo(title, detail) {
  Toast.show({ type: 'success', text1: title, text2: detail })
}

export function toastError(title, detail) {
  Toast.show({ type: 'error', text1: title, text2: detail })
}
