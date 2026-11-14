import { vi } from "vitest";

// jsdom has no audio playback and the player's progress loop reschedules
// itself every animation frame, so player tests replace both.
//
// - `playedSrcs` records which `src` the <audio> element had each time play()
//   was called. "isPlaying is true in the store" is not enough: the failure
//   worth catching is a playing UI over a silent element.
// - Animation frames are queued instead of run. `pendingFrames()` says how
//   many progress loops are alive; `runFrames()` runs one tick of each.
//
// Call from `beforeEach`, and `vi.restoreAllMocks()` in `afterEach`.
export const stubAudio = () => {
  const playedSrcs = [];
  const frames = new Map();
  let nextId = 1;

  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function () {
    playedSrcs.push(this.getAttribute("src"));
    return Promise.resolve();
  });
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(nextId, callback);
    return nextId++;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });

  return {
    playedSrcs,
    pause,
    pendingFrames: () => frames.size,
    runFrames: () => {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback());
    },
  };
};
