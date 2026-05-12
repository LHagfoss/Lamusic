import { createAudioPlayer } from "expo-audio";

/**
 * Extracts the duration of an audio file in seconds.
 * @param uri The URI of the audio file.
 * @returns The duration in seconds, or 0 if extraction fails.
 */
export async function getAudioDuration(uri: string): Promise<number> {
    return new Promise((resolve) => {
        try {
            const player = createAudioPlayer(uri);
            
            // If duration is already available (e.g. cached or local)
            if (player.duration > 0) {
                const duration = Math.floor(player.duration);
                player.remove();
                resolve(duration);
                return;
            }

            // Listen for status updates
            const subscription = player.addListener("playbackStatusUpdate", (status) => {
                if (status.isLoaded && status.duration > 0) {
                    const duration = Math.floor(status.duration);
                    subscription.remove();
                    player.remove();
                    resolve(duration);
                }
            });

            // Set a timeout just in case
            setTimeout(() => {
                subscription.remove();
                player.remove();
                resolve(0);
            }, 5000);
        } catch (error) {
            console.error("Error extracting audio duration:", error);
            resolve(0);
        }
    });
}
