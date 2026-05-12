import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { PressableOpacity } from "pressto";
import { View } from "react-native";
import { AppText } from "./AppText";
import { SymbolView } from "expo-symbols";
import { useCSSVariable } from "uniwind";

export function ArtistCard({ item }: { item: any }) {
    const router = useRouter();
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    function handleOpen() {
        router.push({
            pathname: "/library/artist",
            params: { name: item.name },
        });
    }

    return (
        <View style={{ width: 110 }}>
            <PressableOpacity onPress={handleOpen} style={{ alignItems: "center" }}>
                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={{
                            width: 110,
                            height: 110,
                            borderRadius: 55,
                            marginBottom: 8,
                        }}
                    />
                ) : (
                    <View style={{ width: 110, height: 110, borderRadius: 55, marginBottom: 8, backgroundColor: "#E5E5E5", alignItems: "center", justifyContent: "center" }}>
                        <SymbolView name="person.fill" size={40} tintColor={secondaryText} />
                    </View>
                )}
                <AppText
                    weight="medium"
                    size="sm"
                    numberOfLines={1}
                    className="text-center text-primary-text"
                >
                    {item.name}
                </AppText>
            </PressableOpacity>
        </View>
    );
}
