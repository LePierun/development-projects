import { View, TextInput, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COOLORS } from "@/constants/theme";

export default function InputBar({
  icon = "person-outline",
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  style,
  inputStyle,
}) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainer,
          borderBottomColor: colors.outline,
        },
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={colors.onSurfaceVariant}
        style={styles.icon}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: colors.onSurface,
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 52,

    borderBottomWidth: 1,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    // borderRadius: 12,
    borderTopLeftRadius:12,
    borderTopRightRadius:12,

  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
});