import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { useCSSVariable } from "uniwind";
import { AirplayButton } from "@/modules/airplay-button";
import * as Haptics from "expo-haptics";
import { AmbientBlob } from "@/src/components/AmbientBlob";
import { AppText } from "@/src/components/AppText";
import { usePlayerStore } from "@/src/lib/playerStore";
import { LiquidSlider } from "../components/LiquidSlider";
import { useMusic } from "../hooks/useMusic";

export default function PlayerScreen() {
    const track = usePlayerStore((s) => s.currentTrack);
    const queue = usePlayerStore((s) => s.queue);
    const currentIndex = usePlayerStore((s) => s.currentIndex);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const skipToNext = usePlayerStore((s) => s.skipToNext);
    const skipToPrevious = usePlayerStore((s) => s.skipToPrevious);
    const position = usePlayerStore((s) => s.position);
    const duration = usePlayerStore((s) => s.duration);
    const seekTo = usePlayerStore((s) => s.seekTo);
    const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
    const clearQueue = usePlayerStore((s) => s.clearQueue);
    const skipToIndex = usePlayerStore((s) => s.skipToIndex);
    const repeatMode = usePlayerStore((s) => s.repeatMode);
    const toggleRepeatMode = usePlayerStore((s) => s.toggleRepeatMode);
    const isShuffled = usePlayerStore((s) => s.isShuffled);
    const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

    const router = useRouter();
    const { useRecentSongs, useToggleFavorite } = useMusic();
    const { data: recentSongs } = useRecentSongs();
    const toggleFavoriteMutation = useToggleFavorite();

    const [showQueue, setShowQueue] = useState(false);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        TrackPlayer.getVolume()
            .then(setVolume)
            .catch(() => {});
    }, []);

    const coverScale = useSharedValue(1);
    const overlayOpacity = useSharedValue(0);

    useEffect(() => {
        coverScale.value = withTiming(isPlaying ? 1 : 0.88, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        });
        overlayOpacity.value = withTiming(isPlaying ? 0 : 0.45, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        });
    }, [isPlaying]);

    const coverAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: coverScale.value }],
    }));

    const overlayAnimStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    const fadeTogglePlay = async () => {
        const steps = 8;
        const stepMs = 18;
        if (isPlaying) {
            for (let i = steps - 1; i >= 0; i--) {
                await new Promise<void>((r) => setTimeout(r, stepMs));
                TrackPlayer.setVolume((volume * i) / steps).catch(() => {});
            }
            togglePlay();
            TrackPlayer.setVolume(volume).catch(() => {});
        } else {
            TrackPlayer.setVolume(0).catch(() => {});
            togglePlay();
            for (let i = 1; i <= steps; i++) {
                await new Promise<void>((r) => setTimeout(r, stepMs));
                TrackPlayer.setVolume((volume * i) / steps).catch(() => {});
            }
        }
    };

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const onPrimaryText = String(useCSSVariable("--color-on-primary-text"));
    const foreground = String(useCSSVariable("--color-foreground"));
    const primary = String(useCSSVariable("--color-primary"));

    const currentTrackData = recentSongs?.find((s) => s.id === track?.id);
    const isLiked = currentTrackData?.is_favorite ?? false;

    const handleToggleFavorite = async () => {
        if (!track?.id) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            await toggleFavoriteMutation.mutateAsync({
                songId: track.id.toString(),
                isFavorite: !isLiked,
            });
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const handleSkipPrevious = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        skipToPrevious();
    };

    const handleSkipNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        skipToNext();
    };

    const handleTogglePlay = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        fadeTogglePlay();
    };

    const handleToggleShuffle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Selection);
        toggleShuffle();
    };

    const handleToggleRepeat = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Selection);
        toggleRepeatMode();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progressRatio = duration > 0 ? position / duration : 0;

    const getRepeatIcon = () => {
        switch (repeatMode) {
            case RepeatMode.Track:
                return "repeat.1";
            default:
                return "repeat";
        }
    };

    const isRepeatActive = repeatMode !== RepeatMode.Off;

    return (
        <View className="flex-1 bg-background">
            <View className="px-6 pt-6 pb-6">
                <AmbientBlob
                    color={currentTrackData?.primary_color}
                    blur={40}
                    opacity={0.35}
                    style={{ width: "100%", aspectRatio: 1 }}
                >
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            { borderRadius: 16, overflow: "hidden" },
                            coverAnimStyle,
                        ]}
                    >
                        {track?.cover?.uri ? (
                            <Image
                                source={{ uri: track.cover.uri }}
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <SymbolView
                                    name="music.note"
                                    size={100}
                                    tintColor={secondaryText}
                                />
                            </View>
                        )}
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: "#000000",
                                    borderRadius: 16,
                                },
                                overlayAnimStyle,
                            ]}
                            pointerEvents="none"
                        />
                    </Animated.View>
                </AmbientBlob>
            </View>

            <View className="px-6 flex-row items-center mb-4">
                <View className="flex-1 mr-4">
                    <AppText
                        className="text-primary-text text-2xl font-bold"
                        numberOfLines={1}
                    >
                        {track?.title ?? "No Song Selected"}
                    </AppText>
                    <Pressable
                        onPress={() => {
                            if (!track?.artist) return;
                            router.dismiss();
                            router.navigate({
                                pathname: "/library/artist",
                                params: { name: track.artist },
                            });
                        }}
                    >
                        <AppText className="text-secondary-text text-base mt-0.5">
                            {track?.artist ?? "Unknown Artist"}
                        </AppText>
                    </Pressable>
                </View>
                <Pressable
                    onPress={handleToggleFavorite}
                    disabled={toggleFavoriteMutation.isPending}
                >
                    <GlassView
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 48,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        isInteractive
                    >
                        {toggleFavoriteMutation.isPending ? (
                            <ActivityIndicator size="small" color={primary} />
                        ) : (
                            <SymbolView
                                name={isLiked ? "bookmark.fill" : "bookmark"}
                                size={24}
                                tintColor={isLiked ? primary : secondaryText}
                            />
                        )}
                    </GlassView>
                </Pressable>
            </View>

            {/* Progress Bar with Liquid Slider */}
            <View className="px-6">
                <LiquidSlider
                    progress={progressRatio}
                    activeColor={primary}
                    onSlidingComplete={(value) => {
                        seekTo(value * duration);
                    }}
                />
                <View className="flex-row justify-between mt-1">
                    <AppText className="text-secondary-text text-xs">
                        {formatTime(position)}
                    </AppText>
                    <AppText className="text-secondary-text text-xs">
                        {formatTime(duration)}
                    </AppText>
                </View>
            </View>

            <View className="px-6 mb-6">
                <GlassContainer
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 999,
                        padding: 8,
                    }}
                >
                    <Pressable onPress={handleSkipPrevious}>
                        <GlassView
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            isInteractive
                        >
                            <SymbolView
                                name="backward.fill"
                                size={22}
                                tintColor={primaryText}
                            />
                        </GlassView>
                    </Pressable>

                    <Pressable onPress={handleTogglePlay}>
                        <GlassView
                            style={{
                                width: 86,
                                height: 86,
                                borderRadius: 86,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            isInteractive
                        >
                            <SymbolView
                                name={isPlaying ? "pause.fill" : "play.fill"}
                                size={44}
                                tintColor={primaryText}
                            />
                        </GlassView>
                    </Pressable>

                    <Pressable onPress={handleSkipNext}>
                        <GlassView
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            isInteractive
                        >
                            <SymbolView
                                name="forward.fill"
                                size={22}
                                tintColor={primaryText}
                            />
                        </GlassView>
                    </Pressable>
                </GlassContainer>
            </View>

            {/* Volume */}
            <View className="px-6 mb-6 flex-row items-center gap-3">
                <SymbolView
                    name="speaker.fill"
                    size={16}
                    tintColor={secondaryText}
                />
                <View className="flex-1">
                    <LiquidSlider
                        progress={volume}
                        activeColor={secondaryText}
                        onSlidingComplete={(v) => {
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light,
                            );
                            setVolume(v);
                            TrackPlayer.setVolume(v).catch(() => {});
                        }}
                    />
                </View>
                <SymbolView
                    name="speaker.wave.3.fill"
                    size={16}
                    tintColor={secondaryText}
                />
            </View>

            <View className="px-6 flex-row items-center justify-between">
                <Pressable
                    className="items-center gap-1"
                    onPress={handleToggleShuffle}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isShuffled
                                ? primary
                                : "transparent",
                        }}
                    >
                        <SymbolView
                            name="shuffle"
                            size={22}
                            tintColor={
                                isShuffled ? onPrimaryText : secondaryText
                            }
                        />
                    </View>
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        Shuffle
                    </AppText>
                </Pressable>

                <Pressable
                    className="items-center gap-1"
                    onPress={handleToggleRepeat}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isRepeatActive
                                ? primary
                                : "transparent",
                        }}
                    >
                        <SymbolView
                            name={getRepeatIcon()}
                            size={22}
                            tintColor={
                                isRepeatActive ? onPrimaryText : secondaryText
                            }
                        />
                    </View>
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        {repeatMode === RepeatMode.Track
                            ? "Repeat 1"
                            : "Repeat"}
                    </AppText>
                </Pressable>

                <View className="items-center gap-1">
                    <AirplayButton
                        tintColor={secondaryText}
                        activeTintColor={primary}
                        style={{ width: 44, height: 44 }}
                    />
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        Speakers
                    </AppText>
                </View>

                <Pressable
                    className="items-center gap-1"
                    onPress={() => setShowQueue(true)}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <SymbolView
                            name="list.bullet"
                            size={22}
                            tintColor={secondaryText}
                        />
                    </View>
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        Queue
                    </AppText>
                </Pressable>
            </View>

            <Modal
                visible={showQueue}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowQueue(false)}
            >
                <View
                    className="flex-1 bg-background"
                    style={{ paddingTop: 20 }}
                >
                    <View className="px-6 flex-row justify-between items-center mb-6">
                        <AppText className="text-2xl font-bold">Queue</AppText>
                        <View className="flex-row gap-4 items-center">
                            {queue.length > 0 && (
                                <Pressable
                                    onPress={() => {
                                        clearQueue();
                                        setShowQueue(false);
                                    }}
                                >
                                    <AppText className="text-red-500 font-medium">
                                        Clear
                                    </AppText>
                                </Pressable>
                            )}
                            <Pressable onPress={() => setShowQueue(false)}>
                                <AppText className="text-primary font-medium">
                                    Done
                                </AppText>
                            </Pressable>
                        </View>
                    </View>

                    <FlatList
                        data={queue}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: 40,
                        }}
                        renderItem={({ item, index }) => {
                            const isActive = index === currentIndex;
                            return (
                                <Pressable
                                    onPress={() => {
                                        if (!isActive) {
                                            Haptics.impactAsync(
                                                Haptics.ImpactFeedbackStyle.Light,
                                            );
                                            skipToIndex(index);
                                        }
                                    }}
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.7 : 1,
                                    })}
                                >
                                    <View className="flex-row items-center py-3 border-b border-secondary/20">
                                        <View className="w-12 h-12 rounded-lg bg-secondary overflow-hidden items-center justify-center mr-4">
                                            {item.cover?.uri ? (
                                                <Image
                                                    source={{
                                                        uri: item.cover.uri,
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                    contentFit="cover"
                                                />
                                            ) : (
                                                <SymbolView
                                                    name="music.note"
                                                    size={20}
                                                    tintColor={secondaryText}
                                                />
                                            )}
                                        </View>
                                        <View className="flex-1">
                                            <AppText
                                                className={
                                                    isActive
                                                        ? "text-primary font-bold"
                                                        : "text-primary-text font-medium"
                                                }
                                                numberOfLines={1}
                                            >
                                                {item.title}
                                            </AppText>
                                            <AppText
                                                className="text-secondary-text text-sm"
                                                numberOfLines={1}
                                            >
                                                {item.artist}
                                            </AppText>
                                        </View>
                                        {!isActive && (
                                            <Pressable
                                                onPress={() => {
                                                    Haptics.impactAsync(
                                                        Haptics.ImpactFeedbackStyle.Light,
                                                    );
                                                    removeFromQueue(index);
                                                }}
                                            >
                                                <SymbolView
                                                    name="trash"
                                                    size={18}
                                                    tintColor="#FF3B30"
                                                />
                                            </Pressable>
                                        )}
                                        {isActive && isPlaying && (
                                            <SymbolView
                                                name="waveform"
                                                size={18}
                                                tintColor={primary}
                                            />
                                        )}
                                    </View>
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center py-20">
                                <AppText className="text-secondary-text">
                                    The queue is empty.
                                </AppText>
                            </View>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}
