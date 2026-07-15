import { COOLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { router } from "expo-router";
// import { useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";
export default function NavBackButton({ navigation }) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  return (
    <View style={styles.borders}>
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            navigation.dispatch(StackActions.popToTop());
            // return;
          }
          router.push("/(list)/RoomList")
        }}
        style={[styles.button, { backgroundColor: colors.surfaceContainerHigh }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  borders:{
    width: 64,
    height: 64,
    alignContent:"center",
    justifyContent:"center",
    alignItems:"center",
  },
  button: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 2,
  },
});