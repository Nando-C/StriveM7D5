import { selectSong, setIsPlaying } from "../redux/slices/currentSong";

// The click behaviour shared by every play button outside the player bar.
// - Same track as the one loaded: toggle play/pause.
// - A different track: load it and play it. PlayerControls reacts to the
//   track change itself, so this only has to say "playing".
// - No track to play yet (its list is still loading): do nothing.
export const playOrToggle = (dispatch, { isSameTrack, isPlaying, track }) => {
  if (isSameTrack) {
    dispatch(setIsPlaying(!isPlaying));
    return;
  }
  if (!track) return;
  dispatch(selectSong(track));
  dispatch(setIsPlaying(true));
};
