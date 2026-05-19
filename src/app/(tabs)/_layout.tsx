import * as Haptics from "expo-haptics";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import TrackPlayer from "react-native-track-player";
import { Uniwind, useCSSVariable } from "uniwind";
import { AppText } from "@/src/components/AppText";
import { usePlayerStore } from "@/src/lib/playerStore";
import { useThemeStore } from "@/src/lib/themeStore";

interface AccessoryProps {
    isPaused: boolean;
    onTogglePause: () => void;
    onPrev: () => void;
    onNext: () => void;
    onOpen: () => void;
}

function AccessoryContent({
    isPaused,
    onTogglePause,
    onPrev,
    onNext,
    onOpen,
}: AccessoryProps) {
    const placement = NativeTabs.BottomAccessory.usePlacement();
    const primaryText = String(useCSSVariable("--color-primary-text"));
    const track = usePlayerStore((s) => s.currentTrack);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            "worklet";
            if (event.translationY < -40) {
                scheduleOnRN(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onOpen();
                });
            }
        });

    const handleTogglePause = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onTogglePause();
    };

    const handlePrev = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPrev();
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onNext();
    };

    const handleOpen = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onOpen();
    };

    if (!track) {
        return (
            <View className="flex-1 flex-row items-center px-4 h-full">
                <AppText size="sm" className="text-secondary-text">
                    No Song Playing
                </AppText>
            </View>
        );
    }

    if (placement === "inline") {
        return (
            <GestureDetector gesture={panGesture}>
                <Pressable
                    onPress={handleOpen}
                    className="p-3 flex-row items-center justify-between h-full w-full"
                >
                    <View className="flex-1 flex-row items-center gap-2">
                        <View className="w-8 h-8 bg-secondary rounded-lg overflow-hidden">
                            {track?.cover && (
                                <Image
                                    source={track.cover}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            )}
                        </View>

                        <View className="flex-1">
                            <AppText
                                size="sm"
                                className="text-primary-text"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {track?.title ?? ""}
                            </AppText>
                            <AppText size="xs" className="text-secondary-text">
                                {track?.artist ?? ""}
                            </AppText>
                        </View>
                    </View>

                    <View className="flex-1 flex-row justify-end items-center gap-2">
                        <Pressable
                            onPress={handlePrev}
                            hitSlop={8}
                            className="p-1 aspect-square rounded-full items-center justify-center"
                        >
                            <SymbolView
                                name="backward.fill"
                                size={14}
                                tintColor={primaryText}
                            />
                        </Pressable>

                        <Pressable
                            onPress={handleTogglePause}
                            hitSlop={8}
                            className="p-1 aspect-square"
                        >
                            <SymbolView
                                name={isPaused ? "play.fill" : "pause.fill"}
                                size={18}
                                tintColor={primaryText}
                            />
                        </Pressable>

                        <Pressable
                            onPress={handleNext}
                            hitSlop={8}
                            className="p-1 aspect-square rounded-full items-center justify-center"
                        >
                            <SymbolView
                                name="forward.fill"
                                size={14}
                                tintColor={primaryText}
                            />
                        </Pressable>
                    </View>
                </Pressable>
            </GestureDetector>
        );
    }

    return (
        <GestureDetector gesture={panGesture}>
            <Pressable
                onPress={handleOpen}
                className="p-3 flex-row items-center justify-between h-full w-full"
            >
                <View className="flex-1 flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-secondary rounded-lg overflow-hidden">
                        {track?.cover && (
                            <Image
                                source={track.cover}
                                style={{ width: "100%", height: "100%" }}
                            />
                        )}
                    </View>

                    <View className="flex-1">
                        <AppText
                            size="sm"
                            className="text-primary-text"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {track?.title ?? ""}
                        </AppText>
                        <AppText size="xs" className="text-secondary-text">
                            {track?.artist ?? ""}
                        </AppText>
                    </View>
                </View>

                <View className="flex-row justify-end items-center flex-1">
                    <Pressable
                        onPress={handlePrev}
                        hitSlop={8}
                        className="p-2 aspect-square  rounded-full items-center justify-center"
                    >
                        <SymbolView
                            name="backward.fill"
                            size={18}
                            tintColor={primaryText}
                        />
                    </Pressable>

                    <Pressable
                        onPress={handleTogglePause}
                        hitSlop={8}
                        className="p-2 aspect-square  rounded-full items-center justify-center"
                    >
                        <SymbolView
                            name={isPaused ? "play.fill" : "pause.fill"}
                            size={22}
                            tintColor={primaryText}
                        />
                    </Pressable>

                    <Pressable
                        onPress={handleNext}
                        hitSlop={8}
                        className="p-2 aspect-square rounded-full items-center justify-center"
                    >
                        <SymbolView
                            name="forward.fill"
                            size={18}
                            tintColor={primaryText}
                        />
                    </Pressable>
                </View>
            </Pressable>
        </GestureDetector>
    );
}

export default function TabLayout() {
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const skipToNext = usePlayerStore((s) => s.skipToNext);
    const skipToPrevious = usePlayerStore((s) => s.skipToPrevious);
    const hasTrack = usePlayerStore((s) => s.currentTrack !== null);
    const router = useRouter();

    const primary = String(useCSSVariable("--color-primary"));
    const background = String(useCSSVariable("--color-background"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const isDark = useThemeStore((s) => s.isDark);

    return (
        <NativeTabs
            backgroundColor={background}
            blurEffect={isDark ? "dark" : "light"}
            labelStyle={{
                default: {
                    color: secondaryText,
                },
                color: secondaryText,
            }}
            minimizeBehavior="onScrollDown"
        >
            {hasTrack && (
                <NativeTabs.BottomAccessory>
                    <AccessoryContent
                        isPaused={!isPlaying}
                        onTogglePause={togglePlay}
                        onPrev={skipToPrevious}
                        onNext={skipToNext}
                        onOpen={() => router.navigate("/player")}
                    />
                </NativeTabs.BottomAccessory>
            )}

            <NativeTabs.Trigger
                name="library"
                contentStyle={{ backgroundColor: background }}
            >
                <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor={primary}
                    sf={{
                        default: "play.square.stack",
                        selected: "play.square.stack.fill",
                    }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
                name="saved"
                contentStyle={{ backgroundColor: background }}
            >
                <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor={primary}
                    sf={{ default: "bookmark", selected: "bookmark.fill" }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
                name="upload"
                contentStyle={{ backgroundColor: background }}
            >
                <NativeTabs.Trigger.Label>Upload</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor={primary}
                    sf={{
                        default: "square.and.arrow.up",
                        selected: "square.and.arrow.up.fill",
                    }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
                name="profile"
                contentStyle={{ backgroundColor: background }}
            >
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor={primary}
                    sf={{ default: "person", selected: "person.fill" }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
                name="search"
                contentStyle={{ backgroundColor: background }}
                role="search"
            >
                <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    selectedColor={primary}
                    sf={{
                        default: "magnifyingglass",
                        selected: "magnifyingglass",
                    }}
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
