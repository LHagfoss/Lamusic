import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export function GreetingCard() {
    const router = useRouter();
    const { user } = useAuth();

    const primaryColor = String(useCSSVariable("--color-primary"));
    const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "User";

    return (
        <View className="px-4 pt-2 pb-4">
            <GlassView
                style={{
                    borderRadius: 18,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: primaryColor,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SymbolView
                        name="music.note"
                        size={20}
                        tintColor="#ffffff"
                    />
                </View>

                <View className="flex-1">
                    <AppText className="text-primary-text font-bold text-base">
                        {greeting()}, {firstName}
                    </AppText>
                    <AppText className="text-secondary-text text-sm">
                        Upload a song you love
                    </AppText>
                </View>

                <View>
                    <AppButton
                        title="Upload"
                        onPress={() =>
                            router.navigate("/(tabs)/library/upload")
                        }
                    />
                </View>
            </GlassView>
        </View>
    );
}
