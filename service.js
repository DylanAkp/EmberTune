import TrackPlayer from 'react-native-track-player';
import usePlayer from './src/utils/store/Player';

module.exports = async function() {
    const { playSong, pauseSong } = usePlayer();

    TrackPlayer.addEventListener('remote-play', () => {
        playSong();
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        pauseSong();
    });

    TrackPlayer.addEventListener('remote-next', () => {
        TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener('remote-previous', () => {
        TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener('remote-stop', () => {
        TrackPlayer.destroy();
    });
};