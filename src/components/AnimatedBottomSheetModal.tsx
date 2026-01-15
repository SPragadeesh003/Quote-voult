import React, { ReactNode, useEffect } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { useTheme } from '../context/ThemeContext';
import KeyboardWrapper from './KeyboardWrapper';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedBottomSheetModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
    styles?: any;
    backgroundColor?: string;
    contentKey?: string | number;
}

const AnimatedBottomSheetModal: React.FC<AnimatedBottomSheetModalProps> = ({
    isVisible,
    onClose,
    children,
    styles,
    contentKey,
}) => {
    const { theme } = useTheme();
    const defaultStyles = getStyles(theme);

    const insets = useSafeAreaInsets();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const startY = useSharedValue(0);
    const backdropOpacity = useSharedValue(0);
    const keyboardHeight = useSharedValue(0);

    useKeyboardHandler(
        {
            onStart: (e) => {
                'worklet';
                keyboardHeight.value = e.height;
            },
            onMove: (e) => {
                'worklet';
                keyboardHeight.value = e.height;
            },
            onEnd: (e) => {
                'worklet';
                keyboardHeight.value = e.height;
            },
        },
        []
    );

    const closeModal = () => {
        'worklet';
        backdropOpacity.value = withTiming(0, {
            duration: 250,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateY.value = withTiming(
            SCREEN_HEIGHT,
            {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
            (finished) => {
                if (finished) {
                    scheduleOnRN(onClose);
                }
            }
        );
    };

    useEffect(() => {
        if (isVisible && contentKey) {
            translateY.value = 200;
            translateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
        }
    }, [contentKey, isVisible]);

    useEffect(() => {
        if (isVisible) {
            backdropOpacity.value = withTiming(1, {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            translateY.value = withTiming(0, {
                duration: 350,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
        } else {
            translateY.value = SCREEN_HEIGHT;
            backdropOpacity.value = 0;
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        const safetyMargin = 60;
        const availableHeight = SCREEN_HEIGHT - keyboardHeight.value - safetyMargin;
        const defaultHeight = SCREEN_HEIGHT * 0.9;
        const bottomPadding = keyboardHeight.value > 0 ? 0 : insets.bottom + 20;

        return {
            transform: [{ translateY: translateY.value }],
            maxHeight: keyboardHeight.value > 0 ? availableHeight : defaultHeight,
            paddingBottom: bottomPadding,
        };
    });

    const backdropAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: backdropOpacity.value,
        };
    });

    const panGesture = Gesture.Pan()
        .activeOffsetY(10)
        .onBegin(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const newTranslateY = startY.value + event.translationY;

            if (newTranslateY >= 0) {
                translateY.value = newTranslateY;

                const progress = Math.min(newTranslateY / SCREEN_HEIGHT, 1);
                backdropOpacity.value = Math.max(0.3, 1 - progress * 0.7);
            }
        })
        .onEnd((event) => {
            const shouldClose = event.translationY > 150 || event.velocityY > 800;

            if (shouldClose) {
                closeModal();
            } else {
                translateY.value = withTiming(0, {
                    duration: 250,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
                backdropOpacity.value = withTiming(1, {
                    duration: 250,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
            }
        });

    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={closeModal}
        >
            <KeyboardWrapper>
                <View style={defaultStyles.modalContainer}>
                    <Animated.View
                        style={[styles?.backdrop || defaultStyles.backdrop, backdropAnimatedStyle]}
                    >
                        <Pressable style={{ flex: 1 }} onPress={closeModal} />
                    </Animated.View>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            style={[
                                styles?.sheetContainer || defaultStyles.sheetContainer,
                                animatedStyle,
                            ]}
                        >
                            <View style={styles?.modalHandle || defaultStyles.modalHandle} />
                            {children}
                        </Animated.View>
                    </GestureDetector>
                </View>
            </KeyboardWrapper>
        </Modal>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        sheetContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.cardBackground,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        modalHandle: {
            width: 80,
            height: 5,
            backgroundColor: theme.pillTextUnselected || '#888',
            borderRadius: 3,
            alignSelf: 'center',
            marginBottom: 16,
            marginTop: 8,
        },
    });
};

export default AnimatedBottomSheetModal;