import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import Search from "../Components/Search/Search";
import { makeTrack } from "./fixtures";
import { API, resetSearchLog, searchLog, server } from "./server";
import { renderWithProviders } from "./utils";

// Real timers throughout: the debounce is 400ms, and fake timers combined
// with msw and user-event tend to hang.
const ERROR = "There was an error retrieving the information";
const input = () => screen.getByPlaceholderText(/artists, songs/i);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Search", () => {
  beforeEach(() => resetSearchLog());

  it("loads the placeholder list straight away, under an Explore heading", async () => {
    renderWithProviders(<Search />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Result for i")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(searchLog).toEqual(["i"]);
  });

  it("fires exactly one request per pause in typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Search />);
    await screen.findByText("Result for i");

    await user.type(input(), "que");
    expect(await screen.findByText("Result for que")).toBeInTheDocument();
    expect(searchLog).toEqual(["i", "que"]);

    await user.type(input(), "en");
    expect(await screen.findByText("Result for queen")).toBeInTheDocument();
    expect(searchLog).toEqual(["i", "que", "queen"]);

    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
  });

  it("sends the query URL-encoded", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Search />);
    await screen.findByText("Result for i");

    await user.type(input(), "AC&DC #1");
    expect(await screen.findByText("Result for AC&DC #1")).toBeInTheDocument();
  });

  it("ignores the response of a query that has been superseded", async () => {
    server.use(
      http.get(`${API}/search`, async ({ request }) => {
        const q = new URL(request.url).searchParams.get("q");
        searchLog.push(q);
        if (q === "a") {
          await delay(600);
          return HttpResponse.json({ data: [makeTrack(1, "STALE")] });
        }
        return HttpResponse.json({ data: [makeTrack(2, `Fresh ${q}`)] });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<Search />);
    await screen.findByText("Fresh i");

    await user.type(input(), "a");
    await waitFor(() => expect(searchLog).toContain("a"));
    await user.type(input(), "b");

    expect(await screen.findByText("Fresh ab")).toBeInTheDocument();
    await sleep(700); // long enough for the slow "a" response to have landed
    expect(screen.queryByText("STALE")).not.toBeInTheDocument();
    expect(screen.getByText("Fresh ab")).toBeInTheDocument();
    expect(screen.queryByText(ERROR)).not.toBeInTheDocument();
  });

  it("shows the error state on a network failure, not an endless spinner", async () => {
    server.use(http.get(`${API}/search`, () => HttpResponse.error()));
    renderWithProviders(<Search />);

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows the error state on a server error, then recovers on the next search", async () => {
    server.use(
      http.get(`${API}/search`, () => new HttpResponse(null, { status: 500 }))
    );
    const user = userEvent.setup();
    renderWithProviders(<Search />);
    expect(await screen.findByText(ERROR)).toBeInTheDocument();

    server.resetHandlers();
    await user.type(input(), "abba");

    expect(await screen.findByText("Result for abba")).toBeInTheDocument();
    expect(screen.queryByText(ERROR)).not.toBeInTheDocument();
  });
});
