import { configureStore } from "@reduxjs/toolkit";

import albumsReducer from "../slices/albumList";

export const store = configureStore({
  reducer: {
    albums: albumsReducer,
  },
});
