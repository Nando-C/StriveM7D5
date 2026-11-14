// Vitest globals are off, so jest-dom needs its Vitest entry point (the bare
// import expects a global `expect`) and Testing Library needs an explicit
// cleanup (it only auto-cleans when test globals are on).
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./tests/server";

// Any request without a handler fails the test: nothing reaches the network.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
