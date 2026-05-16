import TrackPlayer, { Event, RepeatMode } from "react-native-track-player";

export const PlaybackService = async function () {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        try { await TrackPlayer.skipToNext(); await TrackPlayer.play(); } catch {}
    });
    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        try {
            const pos = await TrackPlayer.getPosition();
            if (pos > 3) { await TrackPlayer.seekTo(0); }
            else { await TrackPlayer.skipToPrevious(); await TrackPlayer.play(); }
        } catch { await TrackPlayer.seekTo(0); }
    });
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
        const repeatMode = await TrackPlayer.getRepeatMode();
        if (repeatMode !== RepeatMode.Off) {
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
        }
    });
};
