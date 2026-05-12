import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function ManageContentScreen() {
    const params = useLocalSearchParams<{
        id: string;
        type: string;
        title: string;
        image: string;
        artistName?: string;
        duration?: string;
    }>();
    const { id, type, title, image, artistName, duration } = params;

    const router = useRouter();
    const { useDeleteSong, useDeleteAlbum, useDeleteArtist } = useMusic();

    const deleteSong = useDeleteSong();
    const deleteAlbum = useDeleteAlbum();
    const deleteArtist = useDeleteArtist();

    const primaryColor = String(useCSSVariable("--color-primary"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    const isPending =
        deleteSong.isPending || deleteAlbum.isPending || deleteArtist.isPending;

    const handleDelete = () => {
        Alert.alert(
            `Delete ${type.slice(0, -1)}`,
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (type === "Songs") await deleteSong.mutateAsync(id!);
                            else if (type === "Albums") await deleteAlbum.mutateAsync(id!);
                            else if (type === "Artists") await deleteArtist.mutateAsync(id!);
                            router.back();
                        } catch (e) {
                            console.error("Delete failed", e);
                        }
                    },
                },
            ],
        );
    };

    const subtitle =
        type === "Artists"
            ? "Artist"
            : artistName || (type === "Albums" ? "Album" : "Song");

    return (
        <View className="flex-1 bg-background p-5 pt-8 gap-4">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Image + Info row */}
            <View className="flex-row gap-4 items-center">
                <View
                    style={{
                        width: 192,
                        height: 192,
                        borderRadius: type === "Artists" ? 9999 : 16,
                        backgroundColor: "#F2F2F7",
                        overflow: "hidden",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.12,
                        shadowRadius: 12,
                        elevation: 6,
                    }}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <SymbolView
                                name={type === "Artists" ? "person.fill" : "music.note"}
                                size={64}
                                tintColor="#D1D1D6"
                            />
                        </View>
                    )}
                </View>

                <View className="flex-1 gap-1">
                    <AppText
                        className="text-2xl font-bold tracking-tight text-primary-text"
                        numberOfLines={3}
                    >
                        {title}
                    </AppText>
                    <AppText className="text-base text-secondary-text">
                        {subtitle}
                    </AppText>
                    {type === "Songs" && duration && (
                        <AppText className="text-sm text-secondary-text mt-1">
                            {formatDuration(Number(duration))}
                        </AppText>
                    )}
                </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
                <Pressable className="flex-1" onPress={handleDelete} disabled={isPending}>
                    <GlassView
                        style={{
                            height: 48,
                            borderRadius: 24,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            backgroundColor: "rgba(255, 59, 48, 0.1)",
                        }}
                        isInteractive
                    >
                        {isPending ? (
                            <ActivityIndicator size="small" color="#FF3B30" />
                        ) : (
                            <>
                                <SymbolView name="trash.fill" size={18} tintColor="#FF3B30" />
                                <AppText className="font-semibold" style={{ color: "#FF3B30" }}>
                                    Delete
                                </AppText>
                            </>
                        )}
                    </GlassView>
                </Pressable>

                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/profile/my-content/edit",
                            params: params as any,
                        })
                    }
                >
                    <GlassView
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        isInteractive
                    >
                        <SymbolView name="pencil" size={18} tintColor={primaryColor} />
                    </GlassView>
                </Pressable>

                <Pressable onPress={() => router.back()}>
                    <GlassView
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        isInteractive
                    >
                        <SymbolView name="xmark" size={18} tintColor={secondaryText} />
                    </GlassView>
                </Pressable>
            </View>
        </View>
    );
}
