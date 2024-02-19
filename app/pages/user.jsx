import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MyInput from "../components/myinput";
import MyButton from "../components/mybutton";
import { toastError, toastInfo } from "../utils/toast-cfg";
import Page from "../components/page";
import { api } from "../utils/request";
import { useIsFocused } from "@react-navigation/native";

const styles = StyleSheet.create({
  card: {
    borderWidth: 5,
    borderColor: '#E1E1E1',
    borderRadius: 5
  },

  cardHeader: {
    backgroundColor: '#E1E1E1',
    color: '#25ADCE',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 5
  },

  cardBody: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8
  }
})

export default function User({ auth }) {

  const isFocused = useIsFocused();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  useEffect(() => {
    //reset fields when changing screen
    setUserDataFields(auth.profile);
    emptyPasswordFields();
  }, [isFocused])

  return (
    <Page>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>User data</Text>
        <View style={styles.cardBody}>
          <MyInput label="Name" value={name} setValue={setName} />
          <MyInput label="Email" value={email} setValue={setEmail} />
          <MyButton icon="idcard" title="Update" onPress={updateUserData} disabled={!(name.trim() && email.trim())} />
        </View>
      </View>

      <Text />

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Change password</Text>
        <View style={styles.cardBody}>
          <MyInput label="Current password" value={currentPassword} setValue={setCurrentPassword} />
          <MyInput label="New password" value={newPassword} setValue={setNewPassword} />
          <MyInput label="Re-enter new password" value={reNewPassword} setValue={setReNewPassword} />
          <MyButton icon="key" title="Change" onPress={changePassword} disabled={!(currentPassword && newPassword && reNewPassword)} />
        </View>
      </View>

    </Page>
  )

  function updateUserData() {
    api('POST', 'User/ChangeUserData', { name, email }, () => {
      tryForceRefresh('CURRENT', 'User data updated', true);
    })
  }

  function changePassword() {
    if (newPassword.length < 1) { //***************************************************************** 
      toastError('Password must be at least 8 characters');
      return;
    }

    if (currentPassword === newPassword) {
      toastError('The new password is the same as the old one');
      return;
    }

    if (newPassword !== reNewPassword) {
      toastError('Retyping the new password does not match');
      return;
    }

    api('POST', 'User/ChangePassword', { currentPassword, newPassword }, token => {
      emptyPasswordFields();
      tryForceRefresh(token, 'Password changed');
    })
  }

  function tryForceRefresh(token, msgInfo, setFieldsAfter) {
    auth.forceRenewToken(token).then(info => {
      toastInfo(msgInfo);
      if (setFieldsAfter) setUserDataFields(info.userData);
    }).catch(error => {
      toastInfo(msgInfo + ', but due to some problem, please login again!', error.message);
    })
  }

  function setUserDataFields(profileObj) {
    setName(profileObj.name);
    setEmail(profileObj.email);
  }

  function emptyPasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setReNewPassword('');
  }

}