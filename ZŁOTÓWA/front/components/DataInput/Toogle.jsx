import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";

import { COOLORS, rgbToRgba } from "@/constants/theme";

export default function Toggle({
  value = false,
  onEnable,
  onDisable,
  children,
  style,

}) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const [enabled, setEnabled] = useState(value);

  const progress = useSharedValue(
    value ? 1 : 0
  );

  useEffect(() => {

    progress.value = withTiming(
      enabled ? 1 : 0,
      {
        duration: 250,
        easing: Easing.out(Easing.exp),
      }
    );

  }, [enabled]);

  function handlePress() {

    const next = !enabled;

    setEnabled(next);

    if (next) {
      onEnable?.();
    } else {
      onDisable?.();
    }
  }

  const animatedStyle = useAnimatedStyle(() => {

    return {

      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [
          "#00000000",
          // "#47894949",
          colors.surfaceContainerHighest,
        ]
      ),

      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [
          colors.outlineVariant,
          colors.outlineVariant,
        ]
      ),

    //   transform: [
    //     {
    //       scale:
    //         0.98 + progress.value * 0.02,
    //     },
    //   ],
    };
  });


  return (
    <Pressable
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.toggle,
          animatedStyle,
          style,
        ]}
      >
        {children}
        {/* <Animated.Text
          style={[
            styles.text,
            animatedTextStyle,
          ]}
        >
          {label}
        </Animated.Text> */}

      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  toggle: {

    width: "100%",
    // height: 54,

    // paddingHorizontal: 18,
    padding: 2,
    // margin: 4,
    borderRadius: 12,

    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    // elevation: 2,
  },
});