import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, SettingsGroup } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import { useMusic } from "@/src/hooks/useMusic";
import { supabase } from "@/src/lib/supabase";

export default function EditProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { uploadImage } = useMusic();

    const [name, setName] = useState(user?.user_metadata?.full_name || "");
    const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primary = String(useCSSVariable("--color-primary"));

    const currentAvatar =
        newAvatarUri ||
        (user?.user_metadata?.avatar_url?.startsWith("https://")
            ? user.user_metadata.avatar_url
            : null);

    async function pickAvatar() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
    }

    async function handleSave() {
        setSaving(true);
        try {
            let avatarUrl = user?.user_metadata?.avatar_url;

            if (newAvatarUri) {
                avatarUrl = await uploadImage(
                    newAvatarUri,
                    `avatar-${user?.id}`,
                );
            }

            await supabase.auth.updateUser({
                data: { full_name: name.trim(), avatar_url: avatarUrl },
            });

            router.back();
        } catch (e) {
            console.error("Failed to save profile", e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () =>
                        saving ? (
                            <ActivityIndicator size="small" color={primary} />
                        ) : (
                            <Pressable
                                onPress={handleSave}
                                disabled={!name.trim()}
                            >
                                <AppText
                                    className="px-3"
                                    weight="bold"
                                    style={{
                                        color: name.trim()
                                            ? primary
                                            : secondaryText,
                                    }}
                                >
                                    Save
                                </AppText>
                            </Pressable>
                        ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentInsetAdjustmentBehavior="automatic"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center pt-8 pb-6">
                        <PressableOpacity onPress={pickAvatar}>
                            <View className="items-center">
                                <View
                                    style={{
                                        width: 96,
                                        height: 96,
                                        borderRadius: 48,
                                        backgroundColor: "#A7B5FF",
                                        overflow: "hidden",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {currentAvatar ? (
                                        <Image
                                            source={{ uri: currentAvatar }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <AppText
                                            style={{
                                                color: "#fff",
                                                fontSize: 36,
                                                fontWeight: "700",
                                            }}
                                        >
                                            {name[0]?.toUpperCase() ?? "?"}
                                        </AppText>
                                    )}
                                </View>
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: 28,
                                        right: -4,
                                        backgroundColor: primary,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SymbolView
                                        name="camera.fill"
                                        size={14}
                                        tintColor="#fff"
                                    />
                                </View>
                                <AppText
                                    className="mt-3 font-medium"
                                    style={{ color: primary }}
                                >
                                    {newAvatarUri
                                        ? "Photo selected"
                                        : "Change Photo"}
                                </AppText>
                            </View>
                        </PressableOpacity>
                    </View>

                    <SettingsGroup title="Profile Info">
                        <View className="p-4">
                            <AppText
                                className="text-xs mb-1"
                                weight="medium"
                                style={{ color: secondaryText }}
                            >
                                DISPLAY NAME
                            </AppText>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={secondaryText}
                                style={{
                                    color: primaryText,
                                    fontSize: 17,
                                    paddingVertical: 4,
                                }}
                                autoFocus
                            />
                        </View>
                    </SettingsGroup>

                    <View className="px-8 mt-2">
                        <AppText
                            className="text-xs text-center"
                            style={{ color: secondaryText }}
                        >
                            Your Google avatar is used by default. Upload a
                            photo to override it.
                        </AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
