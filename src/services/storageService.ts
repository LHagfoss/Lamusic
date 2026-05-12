import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

export const storageService = {
    async uploadAudio(uri: string, fileName: string) {
        const path = `songs/${Date.now()}-${fileName}`;
        // Using the 'storage' bucket as created by the user
        return this.uploadFile("storage", path, uri, "audio/mpeg");
    },

    async uploadImage(uri: string, fileName: string) {
        const path = `covers/${Date.now()}-${fileName}`;
        // Using the 'storage' bucket as created by the user
        return this.uploadFile("storage", path, uri, "image/jpeg");
    },

    async uploadFile(bucket: string, path: string, uri: string, contentType: string) {
        try {
            // In Expo 55+, the legacy API is required for readAsStringAsync
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, decode(base64), {
                    contentType,
                    upsert: true
                });

            if (error) {
                console.error(`Supabase storage error (Bucket: ${bucket}):`, error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error("Storage upload service error:", error);
            throw error;
        }
    }
};
