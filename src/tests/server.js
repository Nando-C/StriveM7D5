import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { homeTracks, makeTrack } from "./fixtures";

// Must match `test.env.VITE_BACKEND_URL` in vite.config.js.
export const API = "http://localhost:3000/api";

// Every search query the app sent, in order. Cleared by `resetSearchLog`.
export const searchLog = [];
export const resetSearchLog = () => {
  searchLog.length = 0;
};

// One result per query, titled after the query so tests can tell lists apart.
export const searchResult = (q) => [
  makeTrack(900, `Result for ${q}`, { albumId: 900 }),
];

export const handlers = [
  http.get(`${API}/search`, ({ request }) => {
    const q = new URL(request.url).searchParams.get("q");
    searchLog.push(q);
    return HttpResponse.json({ data: q === "the" ? homeTracks : searchResult(q) });
  }),
];

export const server = setupServer(...handlers);
