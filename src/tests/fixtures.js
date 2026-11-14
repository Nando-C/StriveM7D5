// Minimal objects in the shape the Deezer proxy returns.

export const makeTrack = (id, title, overrides = {}) => ({
  id,
  title,
  title_short: title,
  duration: 200 + id,
  rank: 1000 * id,
  preview: `http://localhost:3000/previews/${id}.mp3`,
  md5_image: `md5-album-${overrides.albumId ?? 100}`,
  artist: { id: 10, name: "Test Artist" },
  album: {
    id: overrides.albumId ?? 100,
    title: `${title} (album)`,
    cover_small: `http://localhost:3000/covers/${id}-small.jpg`,
    cover_big: `http://localhost:3000/covers/${id}-big.jpg`,
  },
  ...overrides,
});

export const homeTracks = [
  makeTrack(1, "First Song"),
  makeTrack(2, "Second Song", { albumId: 101 }),
  makeTrack(3, "Third Song", { albumId: 102 }),
];

// GET /artist/:id, /artist/:id/top and /artist/:id/albums. The top tracks are
// deliberately not in rank order: the app sorts them, highest rank first.
export const artist = {
  id: 10,
  name: "Test Artist",
  picture_xl: "http://localhost:3000/covers/artist.jpg",
  nb_fan: 12345,
};

export const artistTopTracks = [
  makeTrack(21, "Lower Ranked", { rank: 100 }),
  makeTrack(22, "Top Ranked", { rank: 900 }),
];

export const artistAlbums = [
  { id: 300, title: "Artist Album", cover_big: "http://localhost:3000/covers/300.jpg" },
];

// An album as returned by GET /album/:id, with its track list embedded.
export const album = {
  id: 100,
  title: "Test Album",
  md5_image: "md5-album-100",
  cover_small: "http://localhost:3000/covers/album-small.jpg",
  cover_big: "http://localhost:3000/covers/album-big.jpg",
  release_date: "2020-01-01",
  nb_tracks: 2,
  duration: 400,
  artist: { id: 10, name: "Test Artist", picture_small: "" },
  tracks: {
    data: [makeTrack(11, "Album Track One"), makeTrack(12, "Album Track Two")],
  },
};
