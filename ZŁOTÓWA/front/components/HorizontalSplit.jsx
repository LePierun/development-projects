import { View, StyleSheet, useColorScheme } from "react-native";
import { COOLORS } from "@/constants/theme";

export default function HorizontalDivider({
  opacity = 0.3,
  marginVertical = 4,
  style,
}) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.outline,
          opacity,
          marginVertical,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: "100%",
  },
});