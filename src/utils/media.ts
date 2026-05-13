import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import ImageColors from "react-native-image-colors";

const MAX_IMAGE_PX = 1200;
const MAX_AUDIO_MB = 100;
const WARN_UNCOMPRESSED_MB = 20;

const UNCOMPRESSED_EXTS = new Set([".wav", ".flac", ".aiff", ".aif"]);

const AUDIO_MIME: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wav: "audio/wav",
    flac: "audio/flac",
    ogg: "audio/ogg",
    opus: "audio/opus",
    webm: "audio/webm",
};

export function getAudioMime(fileName: string): string {
    const ext = fileName.toLowerCase().split(".").pop() ?? "";
    return AUDIO_MIME[ext] ?? "audio/mpeg";
}

export async function compressImage(uri: string): Promise<string> {
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    const sizeMB = ((info as any).size ?? 0) / (1024 * 1024);

    const quality = sizeMB > 4 ? 0.7 : 0.82;

    const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: MAX_IMAGE_PX } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
    );

    return result.uri;
}

export async function extractPrimaryColor(uri: string): Promise<string | null> {
    try {
        const result = await ImageColors.getColors(uri, {
            fallback: "#000000",
            cache: true,
            key: uri,
        });
        if (result.platform === "ios") return result.primary;
        if (result.platform === "android") return result.dominant ?? result.average ?? null;
        return null;
    } catch {
        return null;
    }
}

export interface AudioValidation {
    ok: boolean;
    error?: string;
    warning?: string;
}

export function validateAudioFile(
    name: string,
    sizeBytes: number,
): AudioValidation {
    const mb = sizeBytes / (1024 * 1024);

    if (mb > MAX_AUDIO_MB) {
        return {
            ok: false,
            error: `File is ${mb.toFixed(0)}MB. Max allowed is ${MAX_AUDIO_MB}MB.`,
        };
    }

    const ext = name.toLowerCase().slice(name.lastIndexOf("."));
    if (UNCOMPRESSED_EXTS.has(ext) && mb > WARN_UNCOMPRESSED_MB) {
        return {
            ok: true,
            warning: `${ext.toUpperCase().slice(1)} files can be large (${mb.toFixed(0)}MB). For faster streaming, export as MP3 or AAC instead.`,
        };
    }

    return { ok: true };
}
