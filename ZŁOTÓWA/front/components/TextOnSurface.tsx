import { COOLORS } from "@/constants/theme";
import { Text, TextProps, useColorScheme } from "react-native";

function TextOnSurface({ style, ...props }: TextProps) {
  const usedTheme = useColorScheme() ?? "dark";
  const theme = COOLORS[usedTheme];
  return <Text style={[{ color: theme.onSurface }, style]} {...props} />;
}

export default TextOnSurface;
