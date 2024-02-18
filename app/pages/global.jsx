import React from "react";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Wait from "./wait";
import Login from "./login";
import Home from "./home";
import Config from "./config";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../utils/auth";
import { useAxiosInterceptor } from "../utils/request";
import About from "./about";
import { Image, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Image_loading from "../assets/loading.gif";

const Drawer = createDrawerNavigator();

export default function Global() {

  const auth = useAuth();
  const axiosInterceptor = useAxiosInterceptor(auth);

  return (
    auth.processing ? <Wait /> :
      !auth.profile ?
        <Login auth={auth} />
        :
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home"
            screenOptions={{
              headerRight: () => axiosInterceptor.doing && <Image source={Image_loading} style={{ height: 35, width: 35 }} />
            }}
            drawerContent={props => {
              return (
                <DrawerContentScrollView {...props}>
                  <View style={{ margin: 10, backgroundColor: '#FAD38B', padding: 10, alignItems: 'center' }}>
                    <AntDesign name="user" size={36} color="#976200" />
                    <Text>{auth.profile.name}</Text>
                    <Text>{auth.profile.email}</Text>
                  </View>
                  <DrawerItemList {...props} />
                  <DrawerItem label="Logout" onPress={() => auth.logout()} icon={({ color, size }) => <AntDesign name="logout" size={size} color={color} />} />
                </DrawerContentScrollView>
              )
            }}>
            <Drawer.Screen name="Home" component={Home} options={{ drawerIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} /> }} />
            <Drawer.Screen name="Settings" component={Config} options={{ drawerIcon: ({ color, size }) => <AntDesign name="setting" size={size} color={color} /> }} />
            <Drawer.Screen name="About" component={About} options={{ drawerIcon: ({ color, size }) => <AntDesign name="infocirlceo" size={size} color={color} /> }} />
          </Drawer.Navigator>
        </NavigationContainer>
  )

}