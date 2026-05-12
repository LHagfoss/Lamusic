import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { ActivityIndicator, Pressable, View, Modal, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { useCSSVariable } from "uniwind";
import { AppText } from "@/src/components/AppText";
import { usePlayerStore } from "@/src/lib/playerStore";
import { AppButton } from "../components";
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
    const repeatMode = usePlayerStore((s) => s.repeatMode);
    const toggleRepeatMode = usePlayerStore((s) => s.toggleRepeatMode);

    const router = useRouter();
    const { useRecentSongs, useToggleFavorite } = useMusic();
    const { data: recentSongs } = useRecentSongs();
    const toggleFavoriteMutation = useToggleFavorite();

    const [shuffleOn, setShuffleOn] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showQueue, setShowQueue] = useState(false);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const onPrimaryText = String(useCSSVariable("--color-on-primary-text"));
    const foreground = String(useCSSVariable("--color-foreground"));
    const primary = String(useCSSVariable("--color-primary"));

    const currentTrackData = recentSongs?.find((s) => s.id === track?.id);
    const isLiked = currentTrackData?.is_favorite ?? false;

    const handleToggleFavorite = async () => {
        if (!track?.id) return;
        try {
            await toggleFavoriteMutation.mutateAsync({
                songId: track.id.toString(),
                isFavorite: !isLiked,
            });
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
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
        <View className="bg-background">
            <View className="px-6 pt-6 pb-6">
                <View
                    className="w-full bg-secondary rounded-2xl overflow-hidden items-center justify-center"
                    style={{ aspectRatio: 1 }}
                >
                    {track?.cover?.uri ? (
                        <Image
                            source={{ uri: track.cover.uri }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : (
                        <SymbolView
                            name="music.note"
                            size={100}
                            tintColor={secondaryText}
                        />
                    )}
                </View>
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
                            router.push({
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
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        isInteractive
                    >
                        {toggleFavoriteMutation.isPending ? (
                            <ActivityIndicator size="small" color={primary} />
                        ) : (
                            <SymbolView
                                name={isLiked ? "heart.fill" : "heart"}
                                size={20}
                                tintColor={isLiked ? primary : secondaryText}
                            />
                        )}
                    </GlassView>
                </Pressable>
            </View>

            {/* Progress Bar with Liquid Slider */}
            <View className="px-6 mb-4">
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
                    <Pressable
                        onPress={() => skipToPrevious()}
                    >
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

                    <Pressable onPress={togglePlay}>
                        <GlassView
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 36,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            isInteractive
                        >
                            <SymbolView
                                name={isPlaying ? "pause.fill" : "play.fill"}
                                size={28}
                                tintColor={primaryText}
                            />
                        </GlassView>
                    </Pressable>

                    <Pressable onPress={() => skipToNext()}>
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

            {/* Volume Slider */}
            <View className="px-6 mb-8 flex-row items-center gap-4">
                <SymbolView
                    name="speaker.fill"
                    size={14}
                    tintColor={secondaryText}
                />
                <View className="flex-1">
                    <LiquidSlider
                        progress={volume}
                        activeColor={secondaryText}
                        onValueChange={(val) => {
                            setVolume(val);
                            TrackPlayer.setVolume(val);
                        }}
                    />
                </View>
                <SymbolView
                    name="speaker.wave.3.fill"
                    size={22}
                    tintColor={secondaryText}
                />
            </View>

            <View className="px-6 flex-row items-center justify-between">
                <Pressable
                    className="items-center gap-1"
                    onPress={() => setShuffleOn((v) => !v)}
                >
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: shuffleOn
                                ? foreground
                                : "transparent",
                        }}
                    >
                        <SymbolView
                            name="shuffle"
                            size={20}
                            tintColor={
                                shuffleOn ? onPrimaryText : secondaryText
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
                    onPress={toggleRepeatMode}
                >
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isRepeatActive
                                ? foreground
                                : "transparent",
                        }}
                    >
                        <SymbolView
                            name={getRepeatIcon()}
                            size={20}
                            tintColor={isRepeatActive ? onPrimaryText : secondaryText}
                        />
                    </View>
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        {repeatMode === RepeatMode.Track ? "Repeat 1" : "Repeat"}
                    </AppText>
                </Pressable>

                <Pressable className="items-center gap-1">
                    <SymbolView
                        name="quote.bubble"
                        size={20}
                        tintColor={secondaryText}
                    />
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        Lyrics
                    </AppText>
                </Pressable>

                <Pressable className="items-center gap-1">
                    <SymbolView
                        name="airplayaudio"
                        size={20}
                        tintColor={secondaryText}
                    />
                    <AppText
                        className="text-secondary-text"
                        style={{ fontSize: 10 }}
                    >
                        AirPlay
                    </AppText>
                </Pressable>

                <Pressable 
                    className="items-center gap-1"
                    onPress={() => setShowQueue(true)}
                >
                    <SymbolView
                        name="list.bullet"
                        size={20}
                        tintColor={secondaryText}
                    />
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
                <View className="flex-1 bg-background" style={{ paddingTop: 20 }}>
                    <View className="px-6 flex-row justify-between items-center mb-6">
                        <AppText className="text-2xl font-bold">Queue</AppText>
                        <Pressable onPress={() => setShowQueue(false)}>
                            <AppText className="text-primary font-medium">Done</AppText>
                        </Pressable>
                    </View>

                    <FlatList
                        data={queue}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                        renderItem={({ item, index }) => {
                            const isActive = index === currentIndex;
                            return (
                                <View className="flex-row items-center py-3 border-b border-secondary/20">
                                    <View className="w-12 h-12 rounded-lg bg-secondary overflow-hidden items-center justify-center mr-4">
                                        {item.cover?.uri ? (
                                            <Image source={{ uri: item.cover.uri }} className="w-full h-full" />
                                        ) : (
                                            <SymbolView name="music.note" size={20} tintColor={secondaryText} />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <AppText 
                                            className={isActive ? "text-primary font-bold" : "text-primary-text font-medium"}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </AppText>
                                        <AppText className="text-secondary-text text-sm" numberOfLines={1}>
                                            {item.artist}
                                        </AppText>
                                    </View>
                                    {!isActive && (
                                        <Pressable onPress={() => removeFromQueue(index)}>
                                            <SymbolView name="trash" size={18} tintColor="#FF3B30" />
                                        </Pressable>
                                    )}
                                    {isActive && isPlaying && (
                                        <SymbolView name="waveform" size={18} tintColor={primary} />
                                    )}
                                </View>
                            );
                        }}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center py-20">
                                <AppText className="text-secondary-text">The queue is empty.</AppText>
                            </View>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}
