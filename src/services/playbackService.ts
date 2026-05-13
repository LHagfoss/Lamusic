import TrackPlayer, { Event, RepeatMode } from "react-native-track-player";

export const PlaybackService = async function () {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () =>
        TrackPlayer.skipToNext(),
    );
    TrackPlayer.addEventListener(Event.RemotePrevious, () =>
        TrackPlayer.skipToPrevious(),
    );
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
        const repeatMode = await TrackPlayer.getRepeatMode();
        if (repeatMode !== RepeatMode.Off) {
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
        }
    });
};
