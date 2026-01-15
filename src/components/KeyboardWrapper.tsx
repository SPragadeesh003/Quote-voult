import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";

interface KeyboardWrapperProps {
  children: React.ReactNode;
  offset?: number;
}

const KeyboardWrapper: React.FC<KeyboardWrapperProps> = ({
  children,
  offset = 0,
}) => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        height.value = e.height;
      },
      onMove: (e) => {
        "worklet";
        height.value = e.height + 24;
      },
      onEnd: (e) => {
        "worklet";
        height.value = e.height;
      },
    },
    []
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: height.value + offset - 68,
    };
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
});

export default KeyboardWrapper;
