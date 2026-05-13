import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, Pressable, ScrollView } from "react-native";
import { useCSSVariable } from "uniwind";
import {
    AppText,
    ProfileItem,
    SettingsGroup,
    SettingsItem,
} from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import { usePlayerStore } from "@/src/lib/playerStore";
import { musicService } from "@/src/services/musicService";

export default function ProfileScreen() {
    const dangerText = String(useCSSVariable("--color-danger-text"));

    const { user, signOut } = useAuth();
    const router = useRouter();
    const clearQueue = usePlayerStore((s) => s.clearQueue);

    const [backfillProgress, setBackfillProgress] = useState("");

    const fullName = user?.user_metadata?.full_name || "User";
    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    const handleLogOut = async () => {
        try {
            await clearQueue();
            await signOut();
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    const handleBackfill = async () => {
        setBackfillProgress("Starting...");
        try {
            const done = await musicService.backfillColors((d, total) => {
                setBackfillProgress(`${d} / ${total}`);
            });
            setBackfillProgress("");
            Alert.alert("Done", `Backfilled ${done} records.`);
        } catch (e) {
            setBackfillProgress("");
            Alert.alert("Error", String(e));
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen
                options={{
                    title: "Profile",
                    headerRight: () => (
                        <Pressable
                            onPress={handleLogOut}
                            className="flex-row items-center gap-1 pl-2 pr-3"
                            hitSlop={8}
                        >
                            <SymbolView
                                name="rectangle.portrait.and.arrow.right"
                                size={24}
                                tintColor={dangerText}
                                weight="semibold"
                            />
                            <AppText variant="danger" weight="medium">
                                Log out
                            </AppText>
                        </Pressable>
                    ),
                }}
            />

            <SettingsGroup>
                <ProfileItem
                    name={fullName}
                    email={user?.email ?? ""}
                    initials={initials}
                />
            </SettingsGroup>

            <SettingsGroup title="Preferences">
                <SettingsItem
                    label="Appearance"
                    icon="moon.fill"
                    iconBgColor="#1C1C3A"
                    isLast
                    onPress={() => router.push("/(tabs)/profile/appearance")}
                />
            </SettingsGroup>

            <SettingsGroup title="Account">
                <SettingsItem
                    label="My Content"
                    icon="music.note.list"
                    iconBgColor="#FF9500"
                    isLast
                    onPress={() => router.push("/(tabs)/profile/my-content")}
                />
            </SettingsGroup>

            {__DEV__ && (
                <SettingsGroup title="Developer">
                    <SettingsItem
                        label={backfillProgress || "Backfill Colors"}
                        icon="paintbrush.fill"
                        iconBgColor="#34C759"
                        isLast
                        onPress={handleBackfill}
                    />
                </SettingsGroup>
            )}
        </ScrollView>
    );
}
