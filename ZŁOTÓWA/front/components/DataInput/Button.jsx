import {
  Pressable,
  useColorScheme,
  Text,
  StyleSheet,
} from "react-native";
import { COOLORS } from "@/constants/theme";

export default function ButtonThemed({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary", // primary / secondary / outline / text
  disabled = false,
  children,
}) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.secondaryContainer,
          textColor: colors.onSecondaryContainer,
          borderWidth: 0,
        };

      case "outline":
        return {
          backgroundColor: "transparent",
          textColor: colors.primary,
          borderWidth: 1,
          borderColor: colors.outline,
        };

      case "text":
        return {
          backgroundColor: "transparent",
          textColor: colors.primary,
          borderWidth: 0,
        };

      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.onPrimary,
          borderWidth: 0,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: variantStyles.textColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",

    elevation: 2,
    flex:1,
    minHeightL: "100%",
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});