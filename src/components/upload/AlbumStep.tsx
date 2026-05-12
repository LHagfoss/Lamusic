import { Stack, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import React, { useState } from "react";
import { FlatList, Pressable, View, ActivityIndicator } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

interface AlbumStepProps {
    artistId: string;
    artistName: string;
    onSelect: (album: { id: string; title: string; coverUrl?: string }) => void;
    onBack: () => void;
}

export function AlbumStep({
    artistId,
    artistName,
    onSelect,
    onBack,
}: AlbumStepProps) {
    const { useAlbums } = useMusic();
    const { data: albums, isLoading, isError, refetch } = useAlbums(artistId);
    const router = useRouter();

    const [search, setSearch] = useState("");

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const border = String(useCSSVariable("--color-border"));

    const filteredAlbums =
        albums?.filter((a) =>
            a.title.toLowerCase().includes(search.toLowerCase()),
        ) || [];

    return (
        <View className="flex-1">
            <Stack.Screen
                options={{
                    title: "Select Album",
                    headerSearchBarOptions: {
                        placeholder: `Search albums for ${artistName}...`,
                        onChangeText: (event) =>
                            setSearch(event.nativeEvent.text),
                        hideWhenScrolling: false,
                        textColor: primaryText,
                        hintTextColor: secondaryText,
                    },
                    headerRight: () => null,
                }}
            />

            {isLoading ? (
                <View className="flex-1 items-center justify-center bg-background">
                    <ActivityIndicator size="large" />
                </View>
            ) : isError ? (
                <View className="flex-1 items-center justify-center p-8 bg-background">
                    <AppText className="text-danger mb-4 text-center">Failed to load albums.</AppText>
                    <PressableOpacity onPress={() => refetch()}>
                        <AppText className="text-primary font-bold">Retry</AppText>
                    </PressableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredAlbums}
                    keyExtractor={(item) => item.id.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    ListHeaderComponent={() => (
                        <PressableOpacity
                            onPress={() => router.push("/library/upload/new-album")}
                        >
                            <View
                                className="flex-row items-center p-4 border-b-[0.5px]"
                                style={{ borderBottomColor: border }}
                            >
                                <View className="w-16 h-16 rounded-xl bg-primary/10 items-center justify-center mr-4">
                                    <SymbolView
                                        name="plus"
                                        size={24}
                                        tintColor={primaryText}
                                    />
                                </View>
                                <AppText className="text-base" weight="semibold">
                                    New Album
                                </AppText>
                            </View>
                        </PressableOpacity>
                    )}
                    renderItem={({ item }) => (
                        <PressableOpacity
                            onPress={() =>
                                onSelect({
                                    id: item.id,
                                    title: item.title,
                                    coverUrl: item.cover_url,
                                })
                            }
                        >
                            <View
                                className="flex-row items-center p-4 border-b-[0.5px]"
                                style={{ borderBottomColor: border }}
                            >
                                <View className="w-16 h-16 rounded-xl bg-secondary overflow-hidden mr-4 items-center justify-center">
                                    {item.cover_url ? (
                                        <Image
                                            source={{ uri: item.cover_url }}
                                            style={{ width: "100%", height: "100%" }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <SymbolView
                                            name="music.note.list"
                                            size={24}
                                            tintColor={secondaryText}
                                        />
                                    )}
                                </View>
                                <AppText className="text-base" weight="medium">
                                    {item.title}
                                </AppText>
                            </View>
                        </PressableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View className="p-8 items-center">
                            <AppText className="text-secondary-text">
                                No albums found for this artist
                            </AppText>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
