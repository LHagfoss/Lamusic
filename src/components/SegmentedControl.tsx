import SegmentedControlIOS from "@react-native-segmented-control/segmented-control";
import { View, type StyleProp, type ViewStyle } from "react-native";

interface SegmentedControlProps<T extends string | number> {
    values: readonly T[];
    selectedIndex: number;
    onChange: (index: number) => void;
    style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string | number>({
    values,
    selectedIndex,
    onChange,
    style,
}: SegmentedControlProps<T>) {
    return (
        <View style={[{ paddingHorizontal: 16, paddingVertical: 12 }, style]}>
            <SegmentedControlIOS
                values={values as string[]}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                    onChange(event.nativeEvent.selectedSegmentIndex);
                }}
            />
        </View>
    );
}
