import { configureStore } from "@reduxjs/toolkit";

import albumsReducer from "../slices/albumList";
import chosenReducer from "../slices/chosen";

export const store = configureStore({
  reducer: {
    albums: albumsReducer,
    chosen: chosenReducer,
  },
});
