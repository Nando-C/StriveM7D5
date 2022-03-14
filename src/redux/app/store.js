import { configureStore } from "@reduxjs/toolkit";

import homeReducer from "../slices/home";
import selectedArtistReducer from "../slices/selectedArtist";
import selectedAlbumReducer from "../slices/selectedAlbum";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    selectedArtist: selectedArtistReducer,
    selectedAlbum: selectedAlbumReducer,
  },
});
