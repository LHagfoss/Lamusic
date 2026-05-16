import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import { extractPrimaryColor } from "@/src/utils/media";

export default function EditContentScreen() {
    const {
        id,
        type,
        title: initialTitle,
        image: initialImage,
    } = useLocalSearchParams<{
        id: string;
        type: string;
        title: string;
        image?: string;
    }>();

    const router = useRouter();
    const [title, setTitle] = useState(initialTitle || "");
    const [newImageUri, setNewImageUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { useUpdateSong, useUpdateAlbum, useUpdateArtist, uploadImage } =
        useMusic();

    const updateSong = useUpdateSong();
    const updateAlbum = useUpdateAlbum();
    const updateArtist = useUpdateArtist();

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primary = String(useCSSVariable("--color-primary"));
    const isArtist = type === "Artists";

    // Only show https:// images — local file:// paths are broken/lost
    const currentImageUri =
        newImageUri ||
        (initialImage?.startsWith("https://") ? initialImage : null);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setNewImageUri(result.assets[0].uri);
        }
    }

    const isPending =
        updateSong.isPending ||
        updateAlbum.isPending ||
        updateArtist.isPending ||
        isUploading;

    const handleSave = async () => {
        try {
            setIsUploading(true);

            let imageUrl: string | undefined;
            let primaryColor: string | null | undefined;

            if (newImageUri) {
                const imageName = isArtist
                    ? `artist-${title}`
                    : `cover-${title}`;
                [imageUrl, primaryColor] = await Promise.all([
                    uploadImage(newImageUri, imageName),
                    extractPrimaryColor(newImageUri),
                ]);
            }

            if (type === "Songs") {
                await updateSong.mutateAsync({
                    id: id!,
                    input: {
                        title,
                        ...(imageUrl && {
                            cover_url: imageUrl,
                            primary_color: primaryColor,
                        }),
                    },
                });
            } else if (type === "Albums") {
                await updateAlbum.mutateAsync({
                    id: id!,
                    input: {
                        title,
                        ...(imageUrl && {
                            cover_url: imageUrl,
                            primary_color: primaryColor,
                        }),
                    },
                });
            } else if (type === "Artists") {
                await updateArtist.mutateAsync({
                    id: id!,
                    input: {
                        name: title,
                        ...(imageUrl && {
                            image_url: imageUrl,
                            primary_color: primaryColor,
                        }),
                    },
                });
            }

            router.dismissAll();
            router.navigate("/(tabs)/profile/my-content");
        } catch (e) {
            console.error("Update failed", e);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            {/* Header row */}
            <View
                style={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 12 }}
                className="flex-row items-center justify-between"
            >
                <AppText className="text-xl font-bold text-primary-text">
                    Edit {type?.slice(0, -1)}
                </AppText>
                <Pressable onPress={() => router.back()}>
                    <AppText style={{ color: primary }} className="font-medium text-base">
                        Cancel
                    </AppText>
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="pb-10 gap-4">
                    {/* Image picker */}
                    <View className="items-center pt-6 pb-2">
                        <PressableOpacity onPress={pickImage}>
                            <View className="items-center">
                                <View
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: isArtist ? 60 : 20,
                                        backgroundColor: "#F2F2F7",
                                        overflow: "hidden",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {currentImageUri ? (
                                        <Image
                                            source={{ uri: currentImageUri }}
                                            style={{ width: "100%", height: "100%" }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <SymbolView
                                            name={isArtist ? "person.fill" : "music.note"}
                                            size={44}
                                            tintColor="#D1D1D6"
                                        />
                                    )}
                                </View>
                                <AppText
                                    className="mt-3 font-medium"
                                    style={{ color: primary }}
                                >
                                    {currentImageUri ? "Change Photo" : "Add Photo"}
                                </AppText>
                                {newImageUri && (
                                    <AppText className="text-xs mt-1" style={{ color: secondaryText }}>
                                        New image selected
                                    </AppText>
                                )}
                            </View>
                        </PressableOpacity>
                    </View>

                    {/* Name / Title — matches upload screen glass input style */}
                    <SettingsGroup title={isArtist ? "Artist Info" : type === "Albums" ? "Album Info" : "Song Info"}>
                        <View className="p-4">
                            <AppText
                                className="text-xs mb-1"
                                weight="medium"
                                style={{ color: secondaryText }}
                            >
                                {isArtist ? "NAME" : "TITLE"}
                            </AppText>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder={isArtist ? "Enter artist name" : "Enter title"}
                                placeholderTextColor={secondaryText}
                                style={{ color: primaryText, fontSize: 17, paddingVertical: 4 }}
                            />
                        </View>
                    </SettingsGroup>

                    <View className="px-4">
                        <AppButton
                            title={isUploading ? "Uploading..." : "Save Changes"}
                            onPress={handleSave}
                            loading={isPending}
                            fill
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
