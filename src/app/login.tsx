import { Image } from "expo-image";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginScreen() {
    const { signIn } = useAuth();
    const primaryText = String(useCSSVariable("--color-primary-text"));

    return (
        <View className="flex-1 bg-background justify-center px-6">
            <View className="items-center mb-12">
                <View className="w-24 h-24 mb-6">
                    <Image
                        source={require("@/assets/icon.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </View>
                <AppText className="text-3xl" weight="bold">
                    Lamusic
                </AppText>
                <AppText className="text-secondary-text text-center mt-2 px-8">
                    Your personal music library, everywhere.
                </AppText>
            </View>

            <View className="gap-y-4">
                <AppButton title="Sign in with Google" onPress={signIn} fill />
                <AppText className="text-xs text-secondary-text text-center px-10">
                    By signing in, you agree to our Terms of Service and Privacy
                    Policy.
                </AppText>
            </View>
        </View>
    );
}
