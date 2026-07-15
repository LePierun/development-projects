import { StyleSheet, View, useColorScheme } from "react-native";
import { COOLORS } from "@/constants/theme";

export default function ModalCard({
  children,
  style,
}) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];


  return (
    <View
      style={[
        styles.card,
        styles.center,
        {
          backgroundColor: colors.surfaceContainerHigh,
          shadowColor: colors.shadow || "#000",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // marginHorizontal:8,\
    // mii
    width: "94%",
    // maxHeight: "88%",
    borderRadius: 28,

    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  center: {
    // maxWidth: 420,
    paddingHorizontal: 24,
    paddingVertical: 26,
  },

});