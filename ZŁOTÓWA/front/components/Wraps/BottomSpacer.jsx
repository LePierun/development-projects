import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomSpacer({ height = 96 }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: height + insets.bottom,
      }}
    />
  );
}