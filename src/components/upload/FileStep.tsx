import * as DocumentPicker from "expo-document-picker";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { getAudioDuration } from "@/src/utils/audio";

interface FileStepProps {
    file: DocumentPicker.DocumentPickerAsset | null;
    title: string;
    onFileChange: (
        file: DocumentPicker.DocumentPickerAsset | null,
        duration?: number,
    ) => void;
    onTitleChange: (title: string) => void;
    onNext: () => void;
}

export function FileStep({
    file,
    title,
    onFileChange,
    onTitleChange,
    onNext,
}: FileStepProps) {
    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    async function pickAudio() {
        const result = await DocumentPicker.getDocumentAsync({
            type: "audio/*",
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            // Extract duration
            let duration = 0;
            try {
                duration = await getAudioDuration(asset.uri);
            } catch (e) {
                console.error("Failed to extract duration", e);
            }

            onFileChange(asset, duration);
            if (!title) {
                const fileName = asset.name.split(".")[0];
                onTitleChange(fileName);
            }
        }
    }

    return (
        <View className="flex-1">
            {!file ? (
                <View className="py-20 items-center justify-center">
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
                    <AppButton title="Choose File" onPress={pickAudio} fill />
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
                            <PressableOpacity
                                onPress={() => onFileChange(null)}
                            >
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
                                onChangeText={onTitleChange}
                                placeholderTextColor={secondaryText}
                                style={{
                                    color: primaryText,
                                    fontSize: 17,
                                    paddingVertical: 4,
                                }}
                            />
                        </View>
                    </SettingsGroup>

                    <View className="mt-8 px-4">
                        <AppButton
                            title="Continue"
                            fill
                            disabled={!title}
                            onPress={onNext}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}
