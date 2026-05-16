import { BlurMask, Canvas, Circle } from "@shopify/react-native-skia";
import { useState } from "react";
import { View, type ViewProps } from "react-native";

interface AmbientBlobProps extends ViewProps {
    color?: string | null;
    blur?: number;
    opacity?: number;
    children?: React.ReactNode;
}

export function AmbientBlob({
    color,
    blur = 20,
    opacity = 0.25,
    children,
    style,
    ...rest
}: AmbientBlobProps) {
    const [size, setSize] = useState({ w: 0, h: 0 });

    const overflow = blur * 1.5;

    const cx = size.w / 2 + overflow;
    const cy = size.h / 2 + overflow;
    const r = Math.min(size.w, size.h) / 2;

    return (
        <View
            style={[{ overflow: "visible" }, style]}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setSize({ w: width, h: height });
            }}
            {...rest}
        >
            {!!color && size.w > 0 && (
                <Canvas
                    style={{
                        position: "absolute",
                        top: -overflow,
                        left: -overflow,
                        width: size.w + overflow * 2,
                        height: size.h + overflow * 2,
                    }}
                    pointerEvents="none"
                >
                    <Circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        color={color}
                        opacity={opacity}
                    >
                        <BlurMask blur={blur} style="normal" />
                    </Circle>
                </Canvas>
            )}
            {children}
        </View>
    );
}
