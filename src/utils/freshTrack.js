import { deezerApi } from "../redux/api/deezerApi";
import { toPlayableTrack } from "./track";

// Deezer's preview links stop working about 15 minutes after the API handed
// them out. This asks for the track's album again and returns the track, in
// the player's shape, with a link that works now; `null` when it cannot (the
// request failed, or the album no longer lists the track with a preview).
//
// There is no "one track" endpoint, so the album is the way to a track.
// `forceRefetch`: an album still in the cache holds the old links.
export const fetchFreshTrack = async (dispatch, { id, albumId }) => {
  const request = dispatch(
    deezerApi.endpoints.getAlbum.initiate(albumId, {
      forceRefetch: true,
      subscribe: false,
    }),
  );
  try {
    const album = await request.unwrap();
    const track = album.tracks?.data?.find((candidate) => candidate.id === id);
    return track?.preview ? toPlayableTrack(track, album) : null;
  } catch {
    return null;
  }
};
