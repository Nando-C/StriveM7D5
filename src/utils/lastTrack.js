// Remembers the last track played, in this browser only (there are no
// accounts). Only the ids are kept: the preview link expires within minutes,
// so the track is fetched again when it is restored.
const KEY = "nandotify:lastTrack";

// Storage can be unavailable (private browsing, blocked site data) or hold
// something unexpected; neither may break the player.
export const saveLastTrack = (track) => {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ id: track.id, albumId: track.album.id }),
    );
  } catch {
    // Nothing to do: the track just won't be remembered.
  }
};

export const readLastTrack = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved?.id && saved?.albumId
      ? { id: saved.id, albumId: saved.albumId }
      : null;
  } catch {
    return null;
  }
};
