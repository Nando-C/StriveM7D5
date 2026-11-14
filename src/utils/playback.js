import { selectSong, setIsPlaying } from "../redux/slices/currentSong";
import { toPlayableTrack } from "./track";

// The click behaviour shared by every play button outside the player bar.
// - Same track as the one loaded: toggle play/pause.
// - A different track: load it and play it. PlayerControls reacts to the
//   track change itself, so this only has to say "playing".
// - No track to play yet (its list is still loading): do nothing.
//
// `track` is the object as the API returned it; it is converted to the
// player's own shape here, so no call site can forget to. Pass `album` when
// the track comes from an album's track list.
export const playOrToggle = (
  dispatch,
  { isSameTrack, isPlaying, track, album },
) => {
  if (isSameTrack) {
    dispatch(setIsPlaying(!isPlaying));
    return;
  }
  if (!track) return;
  dispatch(selectSong(toPlayableTrack(track, album)));
  dispatch(setIsPlaying(true));
};
