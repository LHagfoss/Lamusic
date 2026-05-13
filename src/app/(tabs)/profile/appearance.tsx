import { ScrollView } from "react-native";
import { SettingsGroup, SettingsItem } from "@/src/components";
import { useThemeStore } from "@/src/lib/themeStore";

export default function AppearanceScreen() {
    const isDark = useThemeStore((s) => s.isDark);
    const toggleTheme = useThemeStore((s) => s.toggle);

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
        >
            <SettingsGroup>
                <SettingsItem
                    label="Dark Mode"
                    icon="moon.fill"
                    iconBgColor="#1C1C3A"
                    showChevron={false}
                    isLast
                    toggle={{
                        value: isDark,
                        onValueChange: toggleTheme,
                    }}
                />
            </SettingsGroup>
        </ScrollView>
    );
}
