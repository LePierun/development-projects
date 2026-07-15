import { useEffect,  useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { COOLORS } from "@/constants/theme";
import { getCurrentUser, logout } from "@/api/gathersSetters";
import { addOnOfflineReaction, addOnOnlineReaction, GetOnlineStatus } from "@/api/sessionEvent";
import Avatar from "./infoData/Avatar";


export default function MainHeader({ title = "Złotówa" }) {
  const usedTheme = useColorScheme() ?? "dark";
  const color = COOLORS[usedTheme];
  const insets = useSafeAreaInsets();

  const userData = getCurrentUser();

  const [isOnline, setIsOnline] = useState(GetOnlineStatus());

  function handleOffline(){ 
    setIsOnline(false);
  }
  function handleOnline(){
    setIsOnline(true);
  
  }

  useEffect(() => {
    const unmounteDellOn = addOnOfflineReaction(handleOffline)
    const unmounteDellOff = addOnOnlineReaction(handleOnline)
    return ()=>{
      unmounteDellOn()
      unmounteDellOff()
    }
  }, []);

  return (
    <View
      style={[
        styles.topRow,
        {
          paddingTop: insets.top + 4,
          backgroundColor: color.surface,
        },
      ]}
    >
      <Text
        style={[
          styles.tripTitle,
          {
            color: color.onSurface,
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.statusAvatarWraper}>
        {!isOnline && (
          <View style={styles.offlineBadge}>
            <Ionicons
              name="cloud-offline"
              size={24}
              color={color.error}
            />
          </View>
        )}
        <Pressable
          onPress={async () => {
            try {
              await logout();
            } catch (e) {
              console.log("Błąd logout:", e.message);
            } finally {
              router.canGoBack() && router.dismissAll();
              router.replace("/(reglog)/Login");
            }
          }}
        >
          <View
            style={[
              styles.profileBox,
              {
                backgroundColor: color.primaryContainer,
              },
            ]}
          >


            <Ionicons
              name="log-out-outline"
              size={18}
              color={color.onPrimaryContainer}
            />

            <Avatar
              showLabel={false}
              size={30}
              userid={userData?.id}
              name={userData?.name}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 16,
    elevation: 3,
    zIndex: 99,
  },

  tripTitle: {
    fontSize: 18,
    fontWeight: "500",
  },

  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 24,
  },

  offlineBadge: {
    // borderRadius: 8,

    // backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 2,
    // borderColor: "white",
    padding: 2,
  },
  statusAvatarWraper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
