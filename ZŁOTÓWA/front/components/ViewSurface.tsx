import { COOLORS } from "@/constants/theme";
import { useColorScheme, View, ViewProps } from "react-native";

function ViewSurface({ style, ...props }: ViewProps) {
  const usedTheme = useColorScheme() ?? "dark";
  const theme = COOLORS[usedTheme];
  return (
    <View style={[{ backgroundColor: theme.surface }, style]} {...props} />
  );
}

export default ViewSurface;
