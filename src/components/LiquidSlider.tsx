import * as Haptics from "expo-haptics";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface LiquidSliderProps {
    progress: number;
    onValueChange?: (value: number) => void;
    onSlidingStart?: () => void;
    onSlidingComplete?: (value: number) => void;
    activeColor?: string;
}

export function LiquidSlider({
    progress,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    activeColor = "#007AFF",
}: LiquidSliderProps) {
    const isDragging = useSharedValue(false);
    const containerWidth = useSharedValue(0);

    const dragProgress = useSharedValue(progress);
    const startProgress = useSharedValue(0);

    useDerivedValue(() => {
        if (!isDragging.value) {
            dragProgress.value = progress;
        }
    });

    const springConfig = {
        damping: 25,
        stiffness: 150,
        mass: 0.8,
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
        const height = withSpring(isDragging.value ? 16 : 6, springConfig);
        const opacity = withSpring(isDragging.value ? 0.9 : 0.4, springConfig);

        return {
            height,
            opacity,
            borderRadius: 999,
        };
    });

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${dragProgress.value * 100}%`,
            backgroundColor: activeColor,
            height: "100%",
        };
    });

    const gesture = Gesture.Pan()
        .minDistance(0)
        .hitSlop({ vertical: 10 })
        .onStart(() => {
            isDragging.value = true;
            startProgress.value = dragProgress.value;
            if (onSlidingStart) scheduleOnRN(onSlidingStart);
            scheduleOnRN(
                Haptics.impactAsync,
                Haptics.ImpactFeedbackStyle.Light,
            );
        })
        .onUpdate((event) => {
            if (containerWidth.value === 0) return;

            const deltaProgress = event.translationX / containerWidth.value;
            const newProgress = Math.min(
                Math.max(startProgress.value + deltaProgress, 0),
                1,
            );

            dragProgress.value = newProgress;
            if (onValueChange) scheduleOnRN(onValueChange, newProgress);
        })
        .onEnd(() => {
            isDragging.value = false;
            if (onSlidingComplete)
                scheduleOnRN(onSlidingComplete, dragProgress.value);
            scheduleOnRN(
                Haptics.notificationAsync,
                Haptics.NotificationFeedbackType.Success,
            );
        });

    return (
        <View
            className="w-full h-10 justify-center"
            onLayout={(e) =>
                (containerWidth.value = e.nativeEvent.layout.width)
            }
        >
            <GestureDetector gesture={gesture}>
                <Animated.View
                    className="w-full h-full justify-center"
                    style={{ backgroundColor: "transparent" }}
                >
                    <Animated.View
                        style={animatedContainerStyle}
                        className="w-full bg-secondary overflow-hidden"
                    >
                        <Animated.View style={progressStyle} />
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}
