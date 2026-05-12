import { GlassView } from "expo-glass-effect";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "./AppText";

interface SettingsItemProps {
    label: string;
    icon?: SymbolViewProps["name"];
    iconBgColor?: string;
    value?: string;
    showChevron?: boolean;
    onPress?: () => void;
    isLast?: boolean;
}

export function SettingsItem({
    label,
    icon,
    iconBgColor,
    value,
    showChevron = true,
    onPress,
    isLast = false,
}: SettingsItemProps) {
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const border = String(useCSSVariable("--color-border"));

    return (
        <PressableOpacity onPress={onPress}>
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
                    className="flex-1 flex-row items-center pr-4 py-4"
                    style={{
                        borderBottomWidth: isLast ? 0 : 0.5,
                        borderBottomColor: border,
                    }}
                >
                    <AppText className="text-primary-text flex-1" size="md">
                        {label}
                    </AppText>
                    {value && (
                        <AppText className="text-secondary-text mr-2" size="sm">
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
                </View>
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
