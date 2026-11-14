import { configureStore } from "@reduxjs/toolkit";

import { deezerApi } from "../api/deezerApi";
import currentSongReducer from "../slices/currentSong";

// A function, so each test can have a store (and a request cache) of its own.
export const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
      [deezerApi.reducerPath]: deezerApi.reducer,
      currentSong: currentSongReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(deezerApi.middleware),
    preloadedState,
  });

export const store = makeStore();
