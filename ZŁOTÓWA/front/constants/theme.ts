import { StyleSheet } from "react-native";

export type AppTheme = {
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
};

const lightTheme: AppTheme = {
  primary: "rgb(109 94 15)",
  surfaceTint: "rgb(109 94 15)",
  onPrimary: "rgb(255 255 255)",
  primaryContainer: "rgb(248 226 135)",
  onPrimaryContainer: "rgb(83 70 0)",
  secondary: "rgb(102 94 64)",
  onSecondary: "rgb(255 255 255)",
  secondaryContainer: "rgb(238 226 188)",
  onSecondaryContainer: "rgb(78 71 42)",
  tertiary: "rgb(67 102 78)",
  onTertiary: "rgb(255 255 255)",
  tertiaryContainer: "rgb(197 236 206)",
  onTertiaryContainer: "rgb(44 78 56)",
  error: "rgb(186 26 26)",
  onError: "rgb(255 255 255)",
  errorContainer: "rgb(255 218 214)",
  onErrorContainer: "rgb(147 0 10)",
  background: "rgb(255 249 238)",
  onBackground: "rgb(30 27 19)",
  surface: "rgb(255 249 238)",
  onSurface: "rgb(30 27 19)",
  surfaceVariant: "rgb(234 226 208)",
  onSurfaceVariant: "rgb(75 71 57)",
  outline: "rgb(124 119 103)",
  outlineVariant: "rgb(205 198 180)",
  shadow: "rgb(0 0 0)",
  scrim: "rgb(0 0 0)",
  inverseSurface: "rgb(51 48 39)",
  inverseOnSurface: "rgb(247 240 226)",
  inversePrimary: "rgb(219 198 110)",
  primaryFixed: "rgb(248 226 135)",
  onPrimaryFixed: "rgb(34 27 0)",
  primaryFixedDim: "rgb(219 198 110)",
  onPrimaryFixedVariant: "rgb(83 70 0)",
  secondaryFixed: "rgb(238 226 188)",
  onSecondaryFixed: "rgb(33 27 4)",
  secondaryFixedDim: "rgb(209 198 161)",
  onSecondaryFixedVariant: "rgb(78 71 42)",
  tertiaryFixed: "rgb(197 236 206)",
  onTertiaryFixed: "rgb(0 33 15)",
  tertiaryFixedDim: "rgb(169 208 179)",
  onTertiaryFixedVariant: "rgb(44 78 56)",
  surfaceDim: "rgb(224 217 204)",
  surfaceBright: "rgb(255 249 238)",
  surfaceContainerLowest: "rgb(255 255 255)",
  surfaceContainerLow: "rgb(250 243 229)",
  surfaceContainer: "rgb(244 237 223)",
  surfaceContainerHigh: "rgb(238 232 218)",
  surfaceContainerHighest: "rgb(232 226 212)",
};

const darkTheme: AppTheme = {
  primary: "rgb(219 198 110)",
  surfaceTint: "rgb(219 198 110)",
  onPrimary: "rgb(58 48 0)",
  primaryContainer: "rgb(83 70 0)",
  onPrimaryContainer: "rgb(248 226 135)",
  secondary: "rgb(209 198 161)",
  onSecondary: "rgb(54 48 22)",
  secondaryContainer: "rgb(78 71 42)",
  onSecondaryContainer: "rgb(238 226 188)",
  tertiary: "rgb(169 208 179)",
  onTertiary: "rgb(20 55 35)",
  tertiaryContainer: "rgb(44 78 56)",
  onTertiaryContainer: "rgb(197 236 206)",
  error: "rgb(255 180 171)",
  onError: "rgb(105 0 5)",
  errorContainer: "rgb(147 0 10)",
  onErrorContainer: "rgb(255 218 214)",
  background: "rgb(21 19 11)",
  onBackground: "rgb(232 226 212)",
  surface: "rgb(21 19 11)",
  onSurface: "rgb(232 226 212)",
  surfaceVariant: "rgb(75 71 57)",
  onSurfaceVariant: "rgb(205 198 180)",
  outline: "rgb(150 144 128)",
  outlineVariant: "rgb(75 71 57)",
  shadow: "rgb(0 0 0)",
  scrim: "rgb(0 0 0)",
  inverseSurface: "rgb(232 226 212)",
  inverseOnSurface: "rgb(51 48 39)",
  inversePrimary: "rgb(109 94 15)",
  primaryFixed: "rgb(248 226 135)",
  onPrimaryFixed: "rgb(34 27 0)",
  primaryFixedDim: "rgb(219 198 110)",
  onPrimaryFixedVariant: "rgb(83 70 0)",
  secondaryFixed: "rgb(238 226 188)",
  onSecondaryFixed: "rgb(33 27 4)",
  secondaryFixedDim: "rgb(209 198 161)",
  onSecondaryFixedVariant: "rgb(78 71 42)",
  tertiaryFixed: "rgb(197 236 206)",
  onTertiaryFixed: "rgb(0 33 15)",
  tertiaryFixedDim: "rgb(169 208 179)",
  onTertiaryFixedVariant: "rgb(44 78 56)",
  surfaceDim: "rgb(21 19 11)",
  surfaceBright: "rgb(60 57 48)",
  surfaceContainerLowest: "rgb(16 14 7)",
  surfaceContainerLow: "rgb(30 27 19)",
  surfaceContainer: "rgb(34 32 23)",
  surfaceContainerHigh: "rgb(45 42 33)",
  surfaceContainerHighest: "rgb(56 53 43)",
};

export const COOLORS: { dark: AppTheme; light: AppTheme } = {
  light: lightTheme,
  dark: darkTheme,
};

export const AppStyle = StyleSheet.create({
  contener: {
    paddingBottom: 10,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
  },
  h1: {
    fontSize: 20,
    padding: 2,
  },
  header: {
    // borderColor: "yellow",
    // borderBottomWidth: 1,
    // paddingTop: insets.top, to jest w klasie MainHeader
    paddingBottom: 10,
    paddingHorizontal: 24,
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 100,
  },
nav: {
  position: "absolute",
  bottom: 28,
  alignSelf: "center",

  width: 150,
  height: 64,

  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",

  borderRadius: 22,
  borderWidth: 1,

  shadowOpacity: 0.18,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
},
  card: {
    // minWidth: 140,
    
    // padding: 16,
  },
});

export function rgbToRgba(rgb : string, alpha = 0.12) {
  const values = rgb.match(/\d+/g);

  if (!values || values.length < 3) {
    return rgb;
  }

  const [r, g, b] = values;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}