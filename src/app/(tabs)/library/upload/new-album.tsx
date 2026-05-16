import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function NewAlbumScreen() {
    const { artist, setAlbum } = useUploadStore();
    const router = useRouter();
    const { useCreateAlbum, uploadImage } = useMusic();
    const createAlbumMutation = useCreateAlbum();

    const [newTitle, setNewTitle] = useState("");
    const [newCover, setNewCover] = useState<string | null>(null);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primary = String(useCSSVariable("--color-primary"));

    if (!artist) {
        return null;
    }

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setNewCover(result.assets[0].uri);
        }
    }

    async function handleCreate() {
        if (!newTitle) return;
        try {
            // 1. Upload cover if exists
            let coverUrl = null;
            if (newCover) {
                coverUrl = await uploadImage(newCover, `album-${newTitle}`);
            }

            // 2. Create album in DB
            const album = await createAlbumMutation.mutateAsync({
                title: newTitle,
                artist_id: artist!.id,
                cover_url: coverUrl,
            });
            setAlbum({
                id: album.id,
                title: album.title,
                coverUrl: album.cover_url,
            });
            router.dismiss();
            router.navigate("/library/upload/review");
        } catch (error) {
            console.error(error);
            alert("Failed to create album");
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
        >
            <Stack.Screen
                options={{
                    title: "New Album",
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()}>
                            <View className="px-2">
                                <AppText className="text-primary font-medium">
                                    Cancel
                                </AppText>
                            </View>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={handleCreate}
                            disabled={
                                !newTitle || createAlbumMutation.isPending
                            }
                        >
                            <View className="px-2">
                                <AppText
                                    className="font-bold"
                                    style={{
                                        color: !newTitle
                                            ? secondaryText
                                            : primary,
                                    }}
                                >
                                    {createAlbumMutation.isPending
                                        ? "Adding..."
                                        : "Add"}
                                </AppText>
                            </View>
                        </Pressable>
                    ),
                }}
            />

            <View className="items-center mt-10 mb-10">
                <PressableOpacity onPress={pickImage}>
                    <View className="items-center">
                        <View className="w-40 h-40 rounded-2xl bg-secondary overflow-hidden items-center justify-center shadow-sm">
                            {newCover ? (
                                <Image
                                    source={{ uri: newCover }}
                                    style={{ width: "100%", height: "100%" }}
                                    contentFit="cover"
                                />
                            ) : (
                                <SymbolView
                                    name="photo"
                                    size={40}
                                    tintColor={secondaryText}
                                />
                            )}
                        </View>
                        <AppText className="text-primary mt-3 font-medium text-center">
                            Add Cover Art
                        </AppText>
                    </View>
                </PressableOpacity>
            </View>

            <View className="px-4">
                <SettingsGroup title="Album Info">
                    <View className="p-4">
                        <AppText
                            className="text-xs mb-1"
                            weight="medium"
                            style={{ color: secondaryText }}
                        >
                            TITLE
                        </AppText>
                        <TextInput
                            placeholder="Enter album title"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholderTextColor={secondaryText}
                            autoFocus
                            style={{
                                color: primaryText,
                                fontSize: 17,
                                paddingVertical: 4,
                            }}
                        />
                    </View>
                </SettingsGroup>
            </View>
        </ScrollView>
    );
}
