import React from "react";
import { View } from "react-native";
import { 
  Gesture, 
  GestureDetector 
} from "react-native-gesture-handler";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  useDerivedValue
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface LiquidSliderProps {
  progress: number; // 0 to 1
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
  activeColor = "#007AFF"
}: LiquidSliderProps) {
  const isDragging = useSharedValue(false);
  const containerWidth = useSharedValue(0);
  
  // Internal progress state
  const dragProgress = useSharedValue(progress);
  const startProgress = useSharedValue(0);

  // Sync internal progress when external progress changes (only if not dragging)
  useDerivedValue(() => {
    if (!isDragging.value) {
      dragProgress.value = progress;
    }
  });

  const springConfig = { 
    damping: 25, 
    stiffness: 150, 
    mass: 0.8 
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    // Animate height directly. borderRadius 999 keeps pill shape perfect.
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
    .minDistance(0) // Activate immediately
    .hitSlop({ vertical: 10 }) // Extra touch buffer
    .onStart(() => {
      isDragging.value = true;
      startProgress.value = dragProgress.value;
      if (onSlidingStart) runOnJS(onSlidingStart)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      if (containerWidth.value === 0) return;
      
      // Relative Dragging:
      // Finger movement translates directly to progress shift
      const deltaProgress = event.translationX / containerWidth.value;
      const newProgress = Math.min(Math.max(startProgress.value + deltaProgress, 0), 1);
      
      dragProgress.value = newProgress;
      if (onValueChange) runOnJS(onValueChange)(newProgress);
    })
    .onEnd(() => {
      isDragging.value = false;
      if (onSlidingComplete) runOnJS(onSlidingComplete)(dragProgress.value);
      runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
    });

  return (
    <View 
      className="w-full h-10 justify-center"
      onLayout={(e) => (containerWidth.value = e.nativeEvent.layout.width)}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View 
          className="w-full h-full justify-center" 
          style={{ backgroundColor: "transparent" }}
        >
          {/* Track Background */}
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
