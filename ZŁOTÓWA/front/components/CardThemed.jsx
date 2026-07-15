import { AppStyle, COOLORS } from "@/constants/theme";
import { useColorScheme } from "react-native";
import ViewSurface from "./ViewSurface";
import { Children } from "react";


export default function CardThemed({ style, type, children,props }) {
  const usedTheme = useColorScheme() ?? "dark";
  const theme = COOLORS[usedTheme];

  const colorList = {
    1: theme.primary,
    surfaceVariant: theme.surfaceVariant,
    cont2: theme.secondaryContainer,
    surface: theme.surface,
  };

  return (
    <ViewSurface
      style={[{borderRadius: 18}, { backgroundColor: colorList[type] ?? theme.error }, style]}
    >
      {children}
    </ViewSurface>
  );
}
