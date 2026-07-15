import { StackActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export default function MyTransparentModal({
  children,
  backdropColor = "#00000066",
  durationIn = 640,
  durationOut = 220,
  closeOnBackdropPress = true,
  onClose,
  popingScrens = 1,
}) {
  const navi = useNavigation();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const isClosing = useRef(false);

  useEffect(() => {
    Animated.timing(backdropAnim, {
      toValue: 1,
      duration: durationIn,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [backdropAnim, durationIn]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  function closeModal(actionToDispatch = null) {
    if (isClosing.current) return;

    isClosing.current = true;

    Animated.timing(backdropAnim, {
      toValue: 0,
      duration: durationOut,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      if (onClose) {
        onClose();
        return;
      }

      if (actionToDispatch) {
        navi.dispatch(actionToDispatch);
        return;
      }

      navi.dispatch(StackActions.pop(popingScrens));
    });
  }

  useEffect(() => {
    const unsubscribe = navi.addListener("beforeRemove", (e) => {
      if (isClosing.current) return;

      e.preventDefault();
      closeModal(e.data.action);
    });

    return unsubscribe;
  }, [navi]);

  const animatedBackdropColor = backdropAnim.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: ["#00000000", "#00000000", backdropColor],
  });

  const content = (
    <View style={styles.content}>
      {closeOnBackdropPress && (
        <Pressable
          style={styles.dismissArea}
          onPress={() => closeModal()}
        />
      )}

      <View style={styles.centerBox}>{children}</View>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.backdrop,
        {
          backgroundColor: animatedBackdropColor,
          paddingBottom: Platform.OS === "android" ? keyboardHeight : 0,
        },
      ]}
    >
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardRoot}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },

  keyboardRoot: {
    flex: 1,
    width: "100%",
  },

  content: {
    flex: 1,
  },

  centerBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
});