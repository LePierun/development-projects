import NavBar from "@/components/NavBar";
import { Text } from "@react-navigation/elements";
import { Tabs, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import LoginScreen from "./Login";
import RegScreen from "./Reg";
import MainHeader from "@/components/MainHeader";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createMaterialTopTabNavigator(
  // tabBar:(props) => <NavBar {...props} />,
);

export default function MainLayout() {

  return (
    <>
    
      <StatusBar style="auto"></StatusBar>

      {/* <MainHeader /> */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // tabBarPosition: 'bottom',
          // header: () => <MainHeader />,
          swipeEnabled: false,
          animationEnabled: false,
          detachPreviousScreen: false,
        }}
        tabBar={(props) => <></>}
        >

          <Tab.Screen
            name="Login" component={LoginScreen}
          ></Tab.Screen>
          <Tab.Screen
            name="Reg" component={RegScreen}
          ></Tab.Screen>
          {/* <Tab.Screen
            name="history" component={History}
          ></Tab.Screen> */}
      </Tab.Navigator>
      {/* <CardThemed type="1"><TextOnSurface></TextOnSurface></CardThemed> */}
      {/* <View> <TextOnSurface>asdasd</TextOnSurface></View> */}
    </>
  );
}
const styles = StyleSheet.create({
  navWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
    zIndex: 100,
  },
  navBar: {
    borderWidth: 2,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#eee4d4",
  },
});