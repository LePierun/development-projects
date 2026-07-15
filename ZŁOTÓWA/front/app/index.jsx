import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { logout } from "@/api/gathersSetters";
import { setLogoutHandler } from "@/api/sessionEvent";
import { View } from "react-native";
import {  getActiveRoom, getLoged, startupLoad } from "@/api/gathersSetters";

import { COOLORS } from "@/constants/theme";
import { useColorScheme } from "react-native";
import HandSvg from "../components/HandSvg";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [startingId, setStartingId] = useState(null);
  const [isLoged, setIsLoged] = useState(false);
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  

  useEffect(() => {

    async function initApp() {
      await startupLoad();

      
      const activeRoom = getActiveRoom();
      const loged = getLoged();
      setIsLoged(loged)
      setStartingId(activeRoom);
      
    }
    console.log(isLoged);

    initApp().then(()=>{setReady(true)});
  }, []);


if (!ready) {
  return (
    <View style={{backgroundColor: colors.surface, flex: 1, justifyContent: "center", alignItems: "center" }}>
      <HandSvg/>
    </View>
  );
}

if(!isLoged) return <Redirect href={"/(reglog)/Login"}/> ;

if(!startingId) return  <Redirect href={{
        pathname: "/(list)/RoomList",
    }}/>

return <Redirect href={{pathname:"/(main)/DashBoard", params: {roomId: startingId}}}/>


}