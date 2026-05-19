import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useCSSVariable } from "uniwind";
import { AmbientBlob } from "@/src/components/AmbientBlob";
import { AppText } from "@/src/components/AppText";
import { AlbumPageSkeleton } from "@/src/components/Skeleton";
import { useMusic } from "@/src/hooks/useMusic";
import { usePlayerStore } from "@/src/lib/playerStore";
import { formatPlayCount } from "@/src/utils";

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AlbumScreen() {
    const { albumId, artistName } = useLocalSearchParams<{
        albumId: string;
        artistName: string;
    }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const playTrack = usePlayerStore((s) => s.playTrack);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    const { useLibrary, useToggleAlbumFavorite } = useMusic();
    const { data: library, isLoading } = useLibrary();
    const toggleAlbumFavoriteMutation = useToggleAlbumFavorite();

    const artist = library?.find((a) => a.name === artistName);
    const album = artist?.albums?.find((al: any) => al.id === albumId);
    const isLiked = album?.is_favorite ?? false;

    const handleToggleFavorite = async () => {
        if (!album?.id) return;
        try {
            await toggleAlbumFavoriteMutation.mutateAsync({
                albumId: album.id,
                isFavorite: !isLiked,
            });
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    if (isLoading) {
        return <AlbumPageSkeleton />;
    }

    if (!album || !artist) {
        return (
            <View className="flex-1 items-center justify-center">
                <AppText className="text-secondary-text">
                    Album not found
                </AppText>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <Stack.Screen
                options={{
                    title: album.title,
                    unstable_headerRightItems: () => [
                        {
                            type: "button",
                            label: "Save",
                            icon: {
                                type: "sfSymbol",
                                name: isLiked ? "bookmark.fill" : "bookmark",
                            },
                            onPress: handleToggleFavorite,
                        },
                        {
                            type: "menu",
                            label: "More",
                            icon: { type: "sfSymbol", name: "ellipsis" },
                            menu: {
                                items: [
                                    {
                                        type: "action",
                                        label: "Share",
                                        onPress: () => {},
                                    },
                                ],
                            },
                        },
                    ],
                }}
            />

            {/* Album Header */}
            <View className="items-center px-8 pt-4 pb-6">
                <AmbientBlob
                    color={album.primary_color}
                    blur={30}
                    opacity={0.3}
                    style={{ width: 224, aspectRatio: 1, marginBottom: 16 }}
                >
                    {album.cover_url ? (
                        <Image
                            source={{ uri: album.cover_url }}
                            style={{ width: "100%", height: "100%", borderRadius: 16 }}
                        />
                    ) : (
                        <View className="w-full h-full bg-secondary rounded-2xl items-center justify-center">
                            <SymbolView
                                name="music.note.list"
                                size={60}
                                tintColor={secondaryText}
                            />
                        </View>
                    )}
                </AmbientBlob>
                <AppText className="text-primary-text text-2xl font-bold text-center">
                    {album.title}
                </AppText>
                <Pressable
                    onPress={() =>
                        router.navigate({
                            pathname: "/library/artist",
                            params: { name: artist.name },
                        })
                    }
                >
                    <AppText className="text-primary text-base font-medium mt-1">
                        {artist.name}
                    </AppText>
                </Pressable>
                <AppText className="text-secondary-text text-sm mt-1">
                    {(() => {
                        const totalPlays = (album.songs ?? []).reduce(
                            (sum: number, s: any) => sum + (s.play_count ?? 0),
                            0,
                        );
                        return `Album · ${album.songs?.length || 0} songs${totalPlays > 0 ? ` · ${formatPlayCount(totalPlays)} plays` : ""}`;
                    })()}
                </AppText>
            </View>

            {/* Track List */}
            <View
                className="px-4 pb-8"
                style={{ paddingBottom: insets.bottom + 32 }}
            >
                {album.songs?.length === 0 && (
                    <AppText className="text-secondary-text text-center mt-4">
                        No songs in this album.
                    </AppText>
                )}
                {album.songs?.map((track: any, idx: number) => (
                    <Pressable
                        key={track.id}
                        className="flex-row items-center py-3"
                        onPress={() => {
                            playTrack({
                                id: track.id,
                                title: track.title,
                                artist: artist.name,
                                cover: { uri: album.cover_url },
                                url: track.audio_url,
                            });
                            router.navigate({
                                pathname: "/library/song",
                                params: { id: track.id },
                            });
                        }}
                    >
                        <AppText className="text-secondary-text w-7 text-sm text-right mr-4">
                            {idx + 1}
                        </AppText>
                        <View className="flex-1">
                            <AppText
                                className="text-primary-text font-medium"
                                numberOfLines={1}
                            >
                                {track.title}
                            </AppText>
                            <AppText className="text-secondary-text text-xs mt-0.5">
                                Song
                            </AppText>
                        </View>
                        <AppText className="text-secondary-text text-sm ml-4">
                            {formatDuration(track.duration || 0)}
                        </AppText>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}
