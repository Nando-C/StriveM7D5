import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  album,
  artist,
  artistAlbums,
  artistTopTracks,
  deezerError,
  homeTracks,
  makeTrack,
  otherAlbum,
  otherArtist,
  otherArtistAlbums,
  otherArtistTopTracks,
} from "./fixtures";

// Must match `test.env.VITE_BACKEND_URL` in vite.config.js.
export const API = "http://localhost:3000/api";

// What the app sent, in order, recorded as each request starts, so a test
// that replaces a handler does not have to log anything itself. Both are
// cleared after each test (see setupTests.js).
// - `requestLog`: the path of every request, e.g. "/artist/10/top".
// - `searchLog`: the query of every search.
export const requestLog = [];
export const searchLog = [];
export const resetRequestLogs = () => {
  requestLog.length = 0;
  searchLog.length = 0;
};
export const requestsTo = (path) =>
  requestLog.filter((requested) => requested === path).length;

// One result per query, titled after the query so tests can tell lists apart.
export const searchResult = (q) => [
  makeTrack(900, `Result for ${q}`, { albumId: 900 }),
];

// Two artists and two albums are known; any other id gets the answer Deezer
// gives for an unknown one, which is an error in a 200 response.
const byId = (known) => ({ params }) =>
  HttpResponse.json(known[params.id] ?? deezerError);
const listById = (known) => ({ params }) =>
  HttpResponse.json(known[params.id] ? { data: known[params.id] } : deezerError);

export const handlers = [
  http.get(`${API}/search`, ({ request }) => {
    const q = new URL(request.url).searchParams.get("q");
    return HttpResponse.json({ data: q === "the" ? homeTracks : searchResult(q) });
  }),
  http.get(`${API}/artist/:id`, byId({ 10: artist, 20: otherArtist })),
  http.get(
    `${API}/artist/:id/top`,
    listById({ 10: artistTopTracks, 20: otherArtistTopTracks })
  ),
  http.get(
    `${API}/artist/:id/albums`,
    listById({ 10: artistAlbums, 20: otherArtistAlbums })
  ),
  http.get(`${API}/album/:id`, byId({ 100: album, 200: otherAlbum })),
];

export const server = setupServer(...handlers);

server.events.on("request:start", ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api", "");
  requestLog.push(path);
  if (path === "/search") searchLog.push(url.searchParams.get("q"));
});
