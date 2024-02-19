import React, { useState } from "react";
import { Text, View } from "react-native";
import MyInput from "../components/myinput";
import MyButton from "../components/mybutton";
import { request } from "../utils/request";
import { toastError, toastInfo } from "../utils/toast-cfg";

export default function User({ auth }) {

  const [name, setName] = useState(auth.profile.name);
  const [email, setEmail] = useState(auth.profile.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  return (
    <View style={{ margin: 10 }}>

      <MyInput label="Name" value={name} setValue={setName} />
      <MyInput label="Email" value={email} setValue={setEmail} />

      <MyButton title="Update" onPress={updateUserData} />

      <View style={{ borderWidth: 5, borderColor: '#7cdacc', padding: 16, borderRadius: 5, backgroundColor: '#2cb5a0' }}>
        <Text style={{ fontSize: 20 }}>Change password</Text>
        <Text />
        <MyInput label="Current password" value={currentPassword} setValue={setCurrentPassword} />
        <Text />
        <MyInput label="New password" value={newPassword} setValue={setNewPassword} />
        <Text />
        <MyInput label="Re-enter new password" value={reNewPassword} setValue={setReNewPassword} />
        {newPassword !== reNewPassword && <Text style={{ color: 'red' }}>Password does not match</Text>}
        <Text />
        <MyButton title="Change" onPress={change} disabled={!(currentPassword && newPassword && newPassword === reNewPassword)} />
      </View>

    </View>
  )

  function updateUserData() {
    request.post('User/ChangeUserData', { name, email }).then(() => {
      toastInfo('User data updated!');
      auth.forceRenewToken();
    })
  }

  function change() {
    if (newPassword.length < 1) {
      toastError('Password must be at least 8 characters');
      return;
    }

    if (currentPassword === newPassword) {
      toastError('The passwords are the same');
      return;
    }

    request.post('User/ChangePassword', { currentPassword, newPassword }).then(response => {
      toastInfo('Password changed!');
      auth.forceRenewToken(response.data);
    })
  }

}