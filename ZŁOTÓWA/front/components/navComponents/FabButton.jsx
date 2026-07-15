import { COOLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useEffect, useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { addOnOfflineReaction, addOnOnlineReaction, GetOnlineStatus } from "@/api/sessionEvent";
export default function FabButton({
  onPress,
  icon = "add",
  style,
  disabled = false,
  returner = false,
}) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];
  const buttonState = useSharedValue(
    disabled ? 0 : returner ? 2 : 1
  );

  const [isDisabled, setIsDisabled] = useState(disabled)

  useEffect(() => {
    buttonState.value = withTiming(
      isDisabled ? 0 : returner ? 2 : 1,
      {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      }
    );
  }, [isDisabled, returner]);


  function handleOffline(){ 
    setIsDisabled(true);
  }
  function handleOnline(){
    setIsDisabled(false);
  
  }
  useEffect(() => {
    const unmounteDellOn = addOnOfflineReaction(handleOffline)
    const unmounteDellOff = addOnOnlineReaction(handleOnline)
    return ()=>{
      unmounteDellOn()
      unmounteDellOff()
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        buttonState.value,
        [0, 1, 2],
        [
          colors.surfaceContainerHigh,
          colors.primaryContainer,
          colors.errorContainer,
        ]
      ),

      transform: [
        {
          rotate: `${interpolate(
            buttonState.value,
            [0, 1, 2],
            [0, 0, -45]
          )}deg`,
        },
        {
          scale: interpolate(
            buttonState.value,
            [0, 1, 2],
            [0.96, 1, 0.96]
          ),
        },
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        buttonState.value,
        [0, 1, 2],
        [
          colors.surfaceVariant,
          colors.onPrimaryContainer,
          colors.onErrorContainer,
        ]
      ),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.pressable,
        {
          opacity: /*isDisabled ? 0.25 : */pressed ? 0.86 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fab,
          {
            shadowColor: colors.shadow || "#000",
          },
          animatedStyle,
        ]}
      >
        <AnimatedIonicon
          name={icon}
          size={28}
          style={animatedIconStyle}
        />
      </Animated.View>
    </Pressable>
  );
}

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicons);

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
  },

  fab: {
    width: 64,
    height: 64,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    elevation: 6,

    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
});