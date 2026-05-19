import { ScrollView, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { AppText, GreetingCard } from "@/src/components";
import { useCSSVariable } from "uniwind";

export default function NewsScreen() {
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primary = String(useCSSVariable("--color-primary"));

    return (
        <ScrollView 
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
        >
            <View className="p-4 pt-10 items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
                    <SymbolView 
                        name="sparkles" 
                        size={40} 
                        tintColor={primary}
                    />
                </View>
                
                <AppText className="text-2xl text-center mb-2" weight="bold">
                    Welcome to Lamusic
                </AppText>
                
                <AppText className="text-secondary-text text-center px-10 mb-10">
                    Stay tuned for new releases, artist updates, and personalized recommendations.
                </AppText>

                <View className="w-full bg-secondary p-6 rounded-3xl mb-4">
                    <AppText className="text-lg mb-2" weight="bold">
                        Getting Started
                    </AppText>
                    <AppText className="text-secondary-text">
                        Upload your favorite tracks in the Upload tab to start building your personal library.
                    </AppText>
                </View>

                <View className="w-full bg-secondary p-6 rounded-3xl">
                    <AppText className="text-lg mb-2" weight="bold">
                        Favorites
                    </AppText>
                    <AppText className="text-secondary-text">
                        Save songs, albums, and artists to access them quickly from the Saved tab.
                    </AppText>
                </View>
            </View>
        </ScrollView>
    );
}
