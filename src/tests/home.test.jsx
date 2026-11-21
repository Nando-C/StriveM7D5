import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import Home from "../Components/Content/Home/Home";
import { homeTracks } from "./fixtures";
import { API, server } from "./server";
import { renderWithProviders } from "./utils";

describe("Home", () => {
  it("shows the loading state, then the recommended deck", async () => {
    renderWithProviders(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Recommended for today")).toBeInTheDocument();
    for (const track of homeTracks) {
      expect(screen.getByText(track.title)).toBeInTheDocument();
    }
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("links each card to its album and artist", async () => {
    renderWithProviders(<Home />);

    const title = await screen.findByText(homeTracks[1].title);
    expect(title.closest("a")).toHaveAttribute("href", "/Album/101");
    expect(screen.getAllByText("Test Artist")[0].closest("a")).toHaveAttribute(
      "href",
      "/Artist/10"
    );
  });

  it("shows the error state when the request fails", async () => {
    server.use(
      http.get(`${API}/search`, () => new HttpResponse(null, { status: 500 }))
    );
    renderWithProviders(<Home />);

    expect(
      await screen.findByText("There was an error retrieving the information")
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Recommended for today")).not.toBeInTheDocument();
  });

  it("loads the list when Try again is pressed after a failure", async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/search`, () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json({ data: homeTracks });
      })
    );
    renderWithProviders(<Home />);

    fireEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText(homeTracks[0].title)).toBeInTheDocument();
    expect(
      screen.queryByText("There was an error retrieving the information")
    ).not.toBeInTheDocument();
  });

  it("shows only the empty message when the list is empty", async () => {
    server.use(http.get(`${API}/search`, () => HttpResponse.json({ data: [] })));
    renderWithProviders(<Home />);

    expect(
      await screen.findByText("We don't have this album collection")
    ).toBeInTheDocument();
    expect(screen.queryByText("Recommended for today")).not.toBeInTheDocument();
  });

  it("treats a response that is not JSON, such as an HTML page, as a failure", async () => {
    server.use(
      http.get(`${API}/search`, () =>
        HttpResponse.html("<!doctype html><html><body>app</body></html>")
      )
    );
    renderWithProviders(<Home />);

    expect(
      await screen.findByText("There was an error retrieving the information")
    ).toBeInTheDocument();
  });
});
