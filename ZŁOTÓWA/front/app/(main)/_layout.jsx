import { Stack, usePathname, router } from "expo-router";
import NavArea from "@/components/navComponents/navArea";
import FabButton from "@/components/navComponents/FabButton";
import { StatusBar } from "expo-status-bar";
import { GetOnlineStatus } from "@/api/sessionEvent";

export default function FandTLayout() {
  const pathname = usePathname();

  const fabToBack =
    pathname.includes("AddFriendScreen") ||
    pathname.includes("AddTransactionScreen") ||
    pathname.includes("ConfirmTransactionScreen");

  function handleFabPress() {
    if (fabToBack) {
      router.back();
      return;
    }

    router.push("/AddTransactionScreen");
  }

  return (
    <>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
          presentation: "transparentModal",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="(mainPage)"
          options={{
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="AddFriendScreen"
          options={{
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="AddTransactionScreen"
          options={{
            animation: "slide_from_bottom",
          }}
        />

        <Stack.Screen
          name="ConfirmTransactionScreen"
          options={{
            animation: "slide_from_bottom",
          }}
        />
      </Stack>

      <NavArea
        childrenEnd={
          <FabButton
            onPress={handleFabPress}
            returner={fabToBack}
          />
        }
      />
    </>
  );
}