import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";
import { compressImage, getAudioMime } from "../utils/media";

export const storageService = {
    async uploadAudio(uri: string, fileName: string) {
        const path = `songs/${Date.now()}-${fileName}`;
        const mime = getAudioMime(fileName);
        return this.uploadFile("storage", path, uri, mime);
    },

    async uploadImage(uri: string, fileName: string) {
        const compressed = await compressImage(uri);
        const path = `covers/${Date.now()}-${fileName}.jpg`;
        return this.uploadFile("storage", path, compressed, "image/jpeg");
    },

    async uploadFile(
        bucket: string,
        path: string,
        uri: string,
        contentType: string,
    ) {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, decode(base64), {
                    contentType,
                    upsert: true,
                });

            if (error) {
                console.error(
                    `Supabase storage error (Bucket: ${bucket}):`,
                    error,
                );
                throw error;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error("Storage upload service error:", error);
            throw error;
        }
    },
};
