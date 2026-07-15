import { COOLORS } from "@/constants/theme";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
export default function ErrorBox({ message }) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  if (!message) return null;

  return (
    <View
      style={[
        styles.errorBox,
        { backgroundColor: colors.errorContainer },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          { color: colors.onErrorContainer },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    
    
  errorBox: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  errorText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

})