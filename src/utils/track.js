// The one shape `currentSong.track` has, whichever endpoint the track came
// from: exactly what the player bar reads, and the ids the pages compare to
// decide whether "their" track is the one loaded.
//
// The album page passes its album as the second argument, so a track of an
// album's list does not have to carry its own.
export const toPlayableTrack = (track, album = track.album) => ({
  id: track.id,
  title: track.title,
  title_short: track.title_short,
  preview: track.preview,
  duration: track.duration,
  artist: { id: track.artist.id, name: track.artist.name },
  album: { id: album.id, title: album.title, cover_small: album.cover_small },
});
