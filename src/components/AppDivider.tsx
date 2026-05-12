import { View } from "react-native";

export function AppDivider({ marginLeft = 76 }: { marginLeft?: number }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#e8e8e8",
        marginLeft,
      }}
    />
  );
}
