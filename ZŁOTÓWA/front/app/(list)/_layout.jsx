import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MainHeader from "@/components/MainHeader";
import FabButton from "@/components/navComponents/FabButton";
import { usePathname } from "expo-router";
import NavArea from "@/components/navComponents/navArea";
import { GetOnlineStatus } from "@/api/sessionEvent";
export default function NotMainLayout() {
  const pathname = usePathname();
  const isAddRoom = pathname.includes("AddRoomScreen");


  return (
    <>
      <StatusBar style="auto"></StatusBar>
      <MainHeader />
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="RoomList" options={{}} />
        <Stack.Screen name="AddRoomScreen"
          options={{
            presentation: 'transparentModal',
            animation: 'ios_from_right',
            headerShown: false,
            contentStyle: {
              backgroundColor: "#2925ff01"
            },
            detachPreviousScreen: false,

          }} />
      </Stack>

      <NavArea
        childrenEnd={
          <FabButton
            onPress={() =>
              isAddRoom ? router.back() : router.push("/AddRoomScreen")
            }
            returner={isAddRoom}
          />}
      />
    </>
  );
}
