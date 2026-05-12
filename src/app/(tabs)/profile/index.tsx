import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { Pressable, ScrollView, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, SettingsGroup, SettingsItem } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";

export default function ProfileScreen() {
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const _border = String(useCSSVariable("--color-border"));
    const dangerText = String(useCSSVariable("--color-danger"));

    const { user, signOut } = useAuth();
    const router = useRouter();

    const fullName = user?.user_metadata?.full_name || "User";
    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    const handleLogOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    return (
        <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerRight: () => (
                        <Pressable onPress={handleLogOut}>
                            <SymbolView
                                name="rectangle.portrait.and.arrow.right"
                                size={24}
                                tintColor={dangerText}
                                weight="semibold"
                            />
                        </Pressable>
                    ),
                }}
            />

            {/* Profile Header Item */}
            <View className="">
                <SettingsGroup>
                    <PressableOpacity>
                        <View className="flex-row items-center p-4">
                            <View
                                className="items-center justify-center mr-4"
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: "#A7B5FF",
                                }}
                            >
                                <AppText
                                    className="text-white text-2xl"
                                    weight="bold"
                                >
                                    {initials}
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText
                                    className="text-[20px]"
                                    weight="semibold"
                                >
                                    {fullName}
                                </AppText>
                                <AppText className="text-secondary-text text-[14px]">
                                    {user?.email}
                                </AppText>
                            </View>
                            <SymbolView
                                name="chevron.right"
                                size={14}
                                tintColor={secondaryText}
                                weight="semibold"
                            />
                        </View>
                    </PressableOpacity>
                </SettingsGroup>
            </View>

            <SettingsGroup title="Audio">
                <SettingsItem
                    label="Audio Quality"
                    icon="speaker.wave.3.fill"
                    iconBgColor="#5856D6"
                    value="High"
                />
                <SettingsItem
                    label="Equalizer"
                    icon="slider.horizontal.3"
                    iconBgColor="#AF52DE"
                />
                <SettingsItem
                    label="Dolby Atmos"
                    icon="dot.radiowaves.left.and.right"
                    iconBgColor="#007AFF"
                    value="Automatic"
                    isLast
                />
            </SettingsGroup>

            <SettingsGroup title="Playback">
                <SettingsItem
                    label="Crossfade"
                    icon="arrow.triangle.2.circlepath"
                    iconBgColor="#FF9500"
                    value="Off"
                />
                <SettingsItem
                    label="Gapless Playback"
                    icon="music.note.list"
                    iconBgColor="#FF2D55"
                />
                <SettingsItem
                    label="Automix"
                    icon="wand.and.stars"
                    iconBgColor="#5AC8FA"
                    isLast
                />
            </SettingsGroup>

            <SettingsGroup title="Downloads & Storage">
                <SettingsItem
                    label="Download over Cellular"
                    icon="antenna.radiowaves.left.and.right"
                    iconBgColor="#4CD964"
                />
                <SettingsItem
                    label="Storage"
                    icon="internaldrive.fill"
                    iconBgColor="#8E8E93"
                    value="1.2 GB"
                    isLast
                />
            </SettingsGroup>

            <SettingsGroup title="Account">
                <SettingsItem
                    label="My Content"
                    icon="music.note.list"
                    iconBgColor="#FF9500"
                    onPress={() => router.push("/(tabs)/profile/my-content")}
                />
                <SettingsItem
                    label="Linked Services"
                    icon="link"
                    iconBgColor="#007AFF"
                />
                <SettingsItem
                    label="Notifications"
                    icon="bell.fill"
                    iconBgColor="#FF3B30"
                />
                <SettingsItem
                    label="Privacy & Social"
                    icon="person.2.fill"
                    iconBgColor="#4CD964"
                    isLast
                />
            </SettingsGroup>
        </ScrollView>
    );
}
