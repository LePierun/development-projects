import MainHeader from "@/components/MainHeader";
import NavBar from "@/components/NavBar";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DashBoard from "./DashBoard";
import History from "./history";
import { View } from "react-native";

import { useState } from "react";

const Tab = createMaterialTopTabNavigator(
);

export default function MainTab() {
  const [headertitle, setHeaderTitle] = useState("Zlotówa");


  return (
    <View style={{ flex: 1 }}> 
      <MainHeader title={headertitle} />
      
      <Tab.Navigator
        tabBar={(props) => <NavBar {...props} />}
        screenOptions={{
            swipeEnabled: true,
            animationEnabled: true,
        }}
        >
        <Tab.Screen name="DashBoard">
          {(props) => (
              <DashBoard {...props} changeHeader={setHeaderTitle} />
            )}
        </Tab.Screen>
        <Tab.Screen name="History" component={History} />
      </Tab.Navigator>
    </View>
  );
}