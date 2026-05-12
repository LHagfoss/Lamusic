import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function NewArtistScreen() {
    const { setArtist } = useUploadStore();
    const router = useRouter();
    const { useCreateArtist, uploadImage } = useMusic();
    const createArtistMutation = useCreateArtist();

    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState<string | null>(null);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primary = String(useCSSVariable("--color-primary"));

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
        }
    }

    async function handleCreate() {
        if (!newName) return;
        try {
            // 1. Upload photo if exists
            let imageUrl = null;
            if (newImage) {
                imageUrl = await uploadImage(newImage, `artist-${newName}`);
            }

            // 2. Create artist in DB
            const artist = await createArtistMutation.mutateAsync({
                name: newName,
                image_url: imageUrl,
            });
            setArtist({ id: artist.id, name: artist.name });
            router.dismiss();
            router.push("/library/upload/album");
        } catch (error) {
            console.error(error);
            alert("Failed to create artist");
        }
    }

    return (
        <ScrollView className="flex-1">
            <Stack.Screen
                options={{
                    title: "New Artist",
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()}>
                            <View className="px-4">
                                <AppText
                                    className="text-primary-text"
                                    weight="medium"
                                >
                                    Cancel
                                </AppText>
                            </View>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={handleCreate}
                            disabled={
                                !newName || createArtistMutation.isPending
                            }
                        >
                            <View className="px-4">
                                <AppText
                                    className="text-primary"
                                    weight="medium"
                                    style={{
                                        color: !newName
                                            ? secondaryText
                                            : primary,
                                    }}
                                >
                                    {createArtistMutation.isPending
                                        ? "Adding..."
                                        : "Add"}
                                </AppText>
                            </View>
                        </Pressable>
                    ),
                }}
            />

            <View className="items-center mt-32 mb-10">
                <PressableOpacity onPress={pickImage}>
                    <View className="items-center">
                        <View className="w-32 h-32 rounded-full bg-secondary overflow-hidden items-center justify-center shadow-sm">
                            {newImage ? (
                                <Image
                                    source={{ uri: newImage }}
                                    style={{ width: "100%", height: "100%" }}
                                    contentFit="cover"
                                />
                            ) : (
                                <SymbolView
                                    name="person.fill"
                                    size={40}
                                    tintColor={secondaryText}
                                />
                            )}
                        </View>
                        <AppText className="text-primary mt-3 font-medium text-center">
                            Add Photo
                        </AppText>
                    </View>
                </PressableOpacity>
            </View>

            <View className="px-4">
                <SettingsGroup title="Artist Info">
                    <View className="p-4">
                        <AppText
                            className="text-xs mb-1"
                            weight="medium"
                            style={{ color: secondaryText }}
                        >
                            NAME
                        </AppText>
                        <TextInput
                            placeholder="Enter artist name"
                            value={newName}
                            onChangeText={setNewName}
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
