import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import Home from "../Components/Content/Home/Home";
import { homeTracks } from "./fixtures";
import { API, server } from "./server";
import { renderWithProviders } from "./utils";

describe("Home", () => {
  it("shows the loading state, then the recommended deck", async () => {
    renderWithProviders(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Recomended for today")).toBeInTheDocument();
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
    expect(screen.queryByText("Recomended for today")).not.toBeInTheDocument();
  });
});
