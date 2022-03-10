import { configureStore } from "@reduxjs/toolkit";

import homeReducer from "../slices/home";
import chosenReducer from "../slices/chosen";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    chosen: chosenReducer,
  },
});
