import { describe, expect, it } from "vitest";
import { toPlayableTrack } from "../utils/track";

// Each source below is trimmed from what the endpoint really returns: the
// fields differ from one endpoint to the next, the result must not.
const KEYS = [
  "id",
  "title",
  "title_short",
  "preview",
  "duration",
  "artist",
  "album",
];

describe("toPlayableTrack", () => {
  it("converts a search result, which carries its own album", () => {
    const searchTrack = {
      id: 1,
      readable: true,
      title: "Song (Remastered)",
      title_short: "Song",
      link: "https://www.deezer.com/track/1",
      duration: 215,
      rank: 900000,
      explicit_lyrics: false,
      preview: "https://cdn.example/1.mp3",
      md5_image: "abc",
      artist: {
        id: 10,
        name: "Artist",
        picture_small: "p.jpg",
        tracklist: "t",
        type: "artist",
      },
      album: {
        id: 100,
        title: "Album",
        cover_small: "s.jpg",
        cover_big: "b.jpg",
        md5_image: "abc",
        type: "album",
      },
      type: "track",
    };

    const playable = toPlayableTrack(searchTrack);

    expect(playable).toEqual({
      id: 1,
      title: "Song (Remastered)",
      title_short: "Song",
      preview: "https://cdn.example/1.mp3",
      duration: 215,
      artist: { id: 10, name: "Artist" },
      album: { id: 100, title: "Album", cover_small: "s.jpg" },
    });
    expect(Object.keys(playable)).toEqual(KEYS);
  });

  it("takes the album from the second argument for a track of an album's list", () => {
    const album = {
      id: 100,
      title: "Album",
      cover_small: "s.jpg",
      cover_big: "b.jpg",
      nb_tracks: 12,
      release_date: "2001-03-07",
      artist: { id: 10, name: "Artist", picture_small: "p.jpg" },
      tracks: { data: [] },
    };
    // No usable album on the track itself.
    const albumTrack = {
      id: 2,
      title: "Second",
      title_short: "Second",
      duration: 180,
      rank: 500,
      preview: "https://cdn.example/2.mp3",
      artist: { id: 10, name: "Artist", tracklist: "t", type: "artist" },
      type: "track",
    };

    const playable = toPlayableTrack(albumTrack, album);

    expect(playable).toEqual({
      id: 2,
      title: "Second",
      title_short: "Second",
      preview: "https://cdn.example/2.mp3",
      duration: 180,
      artist: { id: 10, name: "Artist" },
      album: { id: 100, title: "Album", cover_small: "s.jpg" },
    });
    expect(Object.keys(playable)).toEqual(KEYS);
  });

  it("prefers the second argument over the track's own album", () => {
    const track = {
      id: 3,
      title: "Third",
      title_short: "Third",
      duration: 100,
      preview: "p.mp3",
      artist: { id: 10, name: "Artist" },
      album: { id: 1, title: "Partial" },
    };

    expect(
      toPlayableTrack(track, { id: 100, title: "Album", cover_small: "s.jpg" })
        .album,
    ).toEqual({ id: 100, title: "Album", cover_small: "s.jpg" });
  });

  it("converts an artist's top track, which has contributors and a rank", () => {
    const topTrack = {
      id: 4,
      title: "Hit",
      title_short: "Hit",
      duration: 224,
      rank: 987654,
      preview: "https://cdn.example/4.mp3",
      contributors: [{ id: 10, name: "Artist", role: "Main" }],
      artist: { id: 10, name: "Artist", tracklist: "t", type: "artist" },
      album: {
        id: 300,
        title: "Hits",
        cover: "c.jpg",
        cover_small: "hs.jpg",
        tracklist: "t",
        type: "album",
      },
      type: "track",
    };

    const playable = toPlayableTrack(topTrack);

    expect(playable).toEqual({
      id: 4,
      title: "Hit",
      title_short: "Hit",
      preview: "https://cdn.example/4.mp3",
      duration: 224,
      artist: { id: 10, name: "Artist" },
      album: { id: 300, title: "Hits", cover_small: "hs.jpg" },
    });
    expect(Object.keys(playable)).toEqual(KEYS);
  });
});
