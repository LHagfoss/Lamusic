import { Stack, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import React, { useState } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

interface ArtistStepProps {
    onSelect: (artist: { id: string; name: string }) => void;
    onBack: () => void;
}

export function ArtistStep({ onSelect, onBack }: ArtistStepProps) {
    const { useArtists } = useMusic();
    const { data: artists, isLoading, isError, refetch } = useArtists();
    const router = useRouter();

    const [search, setSearch] = useState("");

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const border = String(useCSSVariable("--color-border"));

    const filteredArtists =
        artists?.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase()),
        ) || [];

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    title: "Select Artist",
                    headerSearchBarOptions: {
                        placeholder: "Search artists...",
                        onChangeText: (event) =>
                            setSearch(event.nativeEvent.text),
                        hideWhenScrolling: false,
                        textColor: primaryText,
                        hintTextColor: secondaryText,
                    },
                }}
            />

            {isLoading ? (
                <View className="flex-1 items-center justify-center bg-background">
                    <ActivityIndicator size="large" />
                </View>
            ) : isError ? (
                <View className="flex-1 items-center justify-center p-8 bg-background">
                    <AppText className="text-danger mb-4 text-center">
                        Failed to load artists.
                    </AppText>
                    <PressableOpacity onPress={() => refetch()}>
                        <AppText className="text-primary font-bold">
                            Retry
                        </AppText>
                    </PressableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredArtists}
                    keyExtractor={(item) => item.id.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    ListHeaderComponent={() => (
                        <PressableOpacity
                            onPress={() =>
                                router.navigate("/library/upload/new-artist")
                            }
                        >
                            <View
                                className="flex-row items-center p-4 border-b-[0.5px]"
                                style={{ borderBottomColor: border }}
                            >
                                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-3">
                                    <SymbolView
                                        name="plus"
                                        size={20}
                                        tintColor={primaryText}
                                    />
                                </View>
                                <AppText
                                    className="text-base"
                                    weight="semibold"
                                >
                                    New Artist
                                </AppText>
                            </View>
                        </PressableOpacity>
                    )}
                    renderItem={({ item }) => (
                        <PressableOpacity
                            onPress={() =>
                                onSelect({ id: item.id, name: item.name })
                            }
                        >
                            <View
                                className="flex-row items-center p-4 border-b-[0.5px]"
                                style={{ borderBottomColor: border }}
                            >
                                <View className="w-12 h-12 rounded-full bg-secondary overflow-hidden mr-3 items-center justify-center">
                                    {item.image_url ? (
                                        <Image
                                            source={{ uri: item.image_url }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <SymbolView
                                            name="person.fill"
                                            size={20}
                                            tintColor={secondaryText}
                                        />
                                    )}
                                </View>
                                <AppText className="text-base" weight="medium">
                                    {item.name}
                                </AppText>
                            </View>
                        </PressableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View className="p-8 items-center">
                            <AppText className="text-secondary-text">
                                No artists found
                            </AppText>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
