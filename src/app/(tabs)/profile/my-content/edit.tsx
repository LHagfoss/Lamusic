import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

export default function EditContentScreen() {
    const {
        id,
        type,
        title: initialTitle,
    } = useLocalSearchParams<{
        id: string;
        type: string;
        title: string;
    }>();

    const router = useRouter();
    const [title, setTitle] = useState(initialTitle || "");
    const { useUpdateSong, useUpdateAlbum, useUpdateArtist } = useMusic();

    const updateSong = useUpdateSong();
    const updateAlbum = useUpdateAlbum();
    const updateArtist = useUpdateArtist();

    const _border = String(useCSSVariable("--color-border"));

    const handleSave = async () => {
        try {
            if (type === "Songs") {
                await updateSong.mutateAsync({ id: id!, input: { title } });
            } else if (type === "Albums") {
                await updateAlbum.mutateAsync({ id: id!, input: { title } });
            } else if (type === "Artists") {
                await updateArtist.mutateAsync({
                    id: id!,
                    input: { name: title },
                });
            }
            router.dismissAll();
            router.push("/(tabs)/profile/my-content");
        } catch (e) {
            console.error("Update failed", e);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
        >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 pt-20">
                    <AppText className="text-3xl font-bold tracking-tight mb-8 px-2">
                        Edit {type.slice(0, -1)}
                    </AppText>

                    <SettingsGroup title={`${type.slice(0, -1)} Details`}>
                        <View className="p-4">
                            <AppText className="text-xs font-semibold text-secondary-text uppercase mb-1">
                                Title
                            </AppText>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                className="text-primary-text text-xl py-2"
                                placeholder="Enter title..."
                                autoFocus
                                placeholderTextColor="#C7C7CC"
                            />
                        </View>
                    </SettingsGroup>

                    <View className="mt-10 gap-3 px-2">
                        <AppButton
                            title="Save Changes"
                            onPress={handleSave}
                            loading={
                                updateSong.isPending ||
                                updateAlbum.isPending ||
                                updateArtist.isPending
                            }
                            fill
                        />

                        <AppButton
                            title="Cancel"
                            onPress={() => router.back()}
                            variant="ghost"
                            fill
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
