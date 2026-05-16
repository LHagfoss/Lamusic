import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { Alert, ScrollView, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { useUploadStore } from "@/src/lib/uploadStore";
import { getAudioDuration } from "@/src/utils/audio";
import { validateAudioFile } from "@/src/utils/media";

export default function UploadScreen() {
    const {
        file,
        title,
        coverUri,
        setFile,
        setTitle,
        setDuration,
        setCoverUri,
    } = useUploadStore();
    const router = useRouter();

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setCoverUri(result.assets[0].uri);
        }
    }

    async function acceptFile(asset: any) {
        setFile(asset);
        if (!title) {
            setTitle(asset.name.split(".")[0]);
        }
        try {
            const durationSeconds = await getAudioDuration(asset.uri);
            if (durationSeconds > 0) setDuration(durationSeconds);
        } catch (e) {
            console.error("Failed to extract duration", e);
        }
    }

    async function pickAudio() {
        const result = await DocumentPicker.getDocumentAsync({
            type: "audio/*",
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const validation = validateAudioFile(
                asset.name,
                asset.size ?? 0,
            );

            if (!validation.ok) {
                Alert.alert("File Too Large", validation.error);
                return;
            }

            if (validation.warning) {
                Alert.alert(
                    "Large Uncompressed File",
                    validation.warning,
                    [
                        { text: "Pick Different File", style: "cancel" },
                        {
                            text: "Use Anyway",
                            onPress: () => acceptFile(asset),
                        },
                    ],
                );
                return;
            }

            acceptFile(asset);
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            {!file ? (
                <View className="items-center justify-center pt-20">
                    <View className="mb-6 opacity-20">
                        <SymbolView
                            name="arrow.up.circle.fill"
                            size={80}
                            tintColor={primaryText}
                        />
                    </View>
                    <AppText className="text-xl mb-2" weight="bold">
                        Select Audio File
                    </AppText>
                    <AppText className="text-secondary-text text-center mb-8 px-10">
                        Pick an MP3, WAV, or AAC file from your device to start
                        uploading.
                    </AppText>

                    <View className="w-full px-4">
                        <AppButton
                            title="Choose File"
                            onPress={pickAudio}
                            fill
                        />
                    </View>
                </View>
            ) : (
                <View className="mt-4">
                    <SettingsGroup title="Audio File">
                        <View className="flex-row items-center p-4">
                            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
                                <SymbolView
                                    name="music.note"
                                    size={20}
                                    tintColor={primaryText}
                                />
                            </View>
                            <View className="flex-1">
                                <AppText
                                    className="text-base"
                                    weight="semibold"
                                    numberOfLines={1}
                                >
                                    {file.name}
                                </AppText>
                                <AppText className="text-secondary-text text-xs">
                                    {(file.size || 0) / 1000000 > 1
                                        ? `${((file.size || 0) / 1000000).toFixed(1)} MB`
                                        : `${((file.size || 0) / 1024).toFixed(0)} KB`}
                                </AppText>
                            </View>
                            <PressableOpacity onPress={() => setFile(null)}>
                                <AppText className="text-danger font-medium">
                                    Remove
                                </AppText>
                            </PressableOpacity>
                        </View>
                    </SettingsGroup>

                    <SettingsGroup title="Song Details">
                        <View className="p-4">
                            <AppText
                                className="text-xs mb-1"
                                weight="medium"
                                style={{ color: secondaryText }}
                            >
                                TITLE
                            </AppText>
                            <TextInput
                                placeholder="Enter song title"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor={secondaryText}
                                style={{
                                    color: primaryText,
                                    fontSize: 17,
                                    paddingVertical: 4,
                                }}
                            />
                        </View>
                    </SettingsGroup>

                    <SettingsGroup title="Song Cover (Optional)">
                        <PressableOpacity onPress={pickImage}>
                            <View className="p-4 flex-row items-center">
                                <View className="w-16 h-16 rounded-xl bg-secondary overflow-hidden items-center justify-center mr-4">
                                    {coverUri ? (
                                        <Image
                                            source={{ uri: coverUri }}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <SymbolView
                                            name="photo"
                                            size={24}
                                            tintColor={secondaryText}
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <AppText
                                        className="text-base"
                                        weight="medium"
                                    >
                                        {coverUri
                                            ? "Change Cover"
                                            : "Upload Cover"}
                                    </AppText>
                                    <AppText className="text-secondary-text text-sm">
                                        Individual cover for this song.
                                    </AppText>
                                </View>
                                {coverUri && (
                                    <PressableOpacity
                                        onPress={() => setCoverUri(null)}
                                    >
                                        <AppText className="text-danger">
                                            Clear
                                        </AppText>
                                    </PressableOpacity>
                                )}
                            </View>
                        </PressableOpacity>
                    </SettingsGroup>

                    <View className="mt-8 px-4">
                        <AppButton
                            title="Continue"
                            fill
                            disabled={!title}
                            onPress={() => router.navigate("/news/artist")}
                        />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}
