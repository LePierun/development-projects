import { COOLORS } from "@/constants/theme";
import { StyleSheet, View, useColorScheme } from "react-native";

export default function PaddedScreen({  style, backgroundColor,children }) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "light"];
  const bgColor = backgroundColor ?? colors.surface;
  return (
    // <View style={[styles.safe, { backgroundColor: colors.surface, borderWidth:2}]}>
      <View style={[styles.container, { backgroundColor: bgColor}, style]}>
        {children}
      </View>
    // </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // borderWidth:q ,
    paddingHorizontal: 16,
  },
});