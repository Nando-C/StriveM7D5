import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { makeStore } from "../redux/app/store";

// A fresh store per test, built the same way as the app's: so also a fresh
// request cache, and nothing one test fetched is visible to the next.
export const renderWithProviders = (
  ui,
  { preloadedState, store = makeStore(preloadedState), route = "/" } = {}
) => ({
  store,
  ...render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  ),
});
