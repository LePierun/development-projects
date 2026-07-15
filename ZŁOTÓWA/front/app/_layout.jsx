import { router, Stack } from "expo-router";
import { View } from "react-native";
import { COOLORS } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { AppState } from "react-native";
import { logout, uninitialize } from "@/api/gathersSetters";
import { setLogoutHandler } from "@/api/sessionEvent";
export default function RootLayout() {
  const theme = useColorScheme();
  const colors = COOLORS[theme ?? "dark"];

  async function uninitApp() {
    await uninitialize();
  }
  useEffect(() => {
    setLogoutHandler(async () => {
        await logout();

        router.dismissAll?.();
        router.replace("/(reglog)/Login");
    });
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        uninitApp();
      }
    });

    return () => {
      subscription.remove();
      uninitApp();
    };
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          detachPreviousScreen: false,
        }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(list)" />
        <Stack.Screen name="(reglog)" />
      </Stack>
    </View>
  );
}