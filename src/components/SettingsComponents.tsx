import { GlassView } from "expo-glass-effect";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { Switch, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { useThemeStore } from "@/src/lib/themeStore";
import { AppText } from "./AppText";

interface SettingsItemProps {
    label: string;
    icon?: SymbolViewProps["name"];
    iconBgColor?: string;
    value?: string;
    showChevron?: boolean;
    onPress?: () => void;
    isLast?: boolean;
    toggle?: {
        value: boolean;
        onValueChange: (value: boolean) => void;
    };
}

export function SettingsItem({
    label,
    icon,
    iconBgColor,
    value,
    showChevron = true,
    onPress,
    isLast = false,
    toggle,
}: SettingsItemProps) {
    useThemeStore((s) => s.isDark);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const border = String(useCSSVariable("--color-border"));
    const primary = String(useCSSVariable("--color-primary"));

    const hasToggle = !!toggle;

    return (
        <PressableOpacity
            onPress={hasToggle ? undefined : onPress}
            disabled={hasToggle && !onPress}
        >
            <View className="flex-row items-center pl-4">
                {icon && (
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            backgroundColor: iconBgColor || "#007AFF",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        <SymbolView name={icon} size={18} tintColor="white" />
                    </View>
                )}
                <View
                    className="flex-1 flex-row items-center pr-4 py-3"
                    style={{
                        borderBottomWidth: isLast ? 0 : 0.5,
                        borderBottomColor: border,
                    }}
                >
                    <AppText className="text-primary-text flex-1" size="md">
                        {label}
                    </AppText>
                    {hasToggle ? (
                        <Switch
                            value={toggle.value}
                            onValueChange={toggle.onValueChange}
                            trackColor={{ false: secondaryText, true: primary }}
                            thumbColor="#ffffff"
                        />
                    ) : (
                        <>
                            {value && (
                                <AppText
                                    className="text-secondary-text mr-2"
                                    size="sm"
                                >
                                    {value}
                                </AppText>
                            )}
                            {showChevron && (
                                <SymbolView
                                    name="chevron.right"
                                    size={14}
                                    tintColor={secondaryText}
                                    weight="semibold"
                                />
                            )}
                        </>
                    )}
                </View>
            </View>
        </PressableOpacity>
    );
}

interface ProfileItemProps {
    name: string;
    email: string;
    initials: string;
    onPress?: () => void;
}

export function ProfileItem({
    name,
    email,
    initials,
    onPress,
}: ProfileItemProps) {
    useThemeStore((s) => s.isDark);
    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    return (
        <PressableOpacity onPress={onPress}>
            <View className="flex-row items-center p-4">
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "#A7B5FF",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                    }}
                >
                    <AppText
                        style={{
                            color: "#ffffff",
                            fontSize: 24,
                            fontWeight: "700",
                        }}
                    >
                        {initials}
                    </AppText>
                </View>
                <View style={{ flex: 1 }}>
                    <AppText
                        style={{
                            color: primaryText,
                            fontSize: 20,
                            fontWeight: "600",
                        }}
                    >
                        {name}
                    </AppText>
                    <AppText style={{ color: secondaryText, fontSize: 14 }}>
                        {email}
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
    );
}

interface SettingsGroupProps {
    children: React.ReactNode;
    title?: string;
}

export function SettingsGroup({ children, title }: SettingsGroupProps) {
    return (
        <View className="mb-8 px-4">
            {title && (
                <AppText
                    className="text-secondary-text uppercase mb-2 px-1"
                    size="sm"
                    weight="medium"
                >
                    {title}
                </AppText>
            )}
            <GlassView
                style={{
                    borderRadius: 24,
                    overflow: "hidden",
                }}
            >
                {children}
            </GlassView>
        </View>
    );
}
