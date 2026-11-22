import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { NO_PREVIEW, playOrToggle } from "../../../utils/playback";
import "./AlbumCard.css";

// How wide a card is at each of the grid's breakpoints, for `srcset`: the
// room beside the 240px sidebar, shared by 6, 5, 4, 3 or 2 columns, and the
// full width on a phone, where there is no sidebar and one column.
const COVER_SIZES = [
  "(min-width: 1400px) calc((100vw - 240px) / 6)",
  "(min-width: 1200px) calc((100vw - 240px) / 5)",
  "(min-width: 992px) calc((100vw - 240px) / 4)",
  "(min-width: 768px) calc((100vw - 240px) / 3)",
  "(min-width: 576px) calc((100vw - 240px) / 2)",
  "100vw",
].join(", ");

// `eager`: load the cover at once. For the first cards of a page, which are
// on screen from the start; the rest load as they are scrolled to.
const AlbumCard = (props) => {
  // A track (home, search) keeps its covers on its album; an album has them.
  const cover = props.album.cover_big ? props.album : props.album.album;
  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const track = useSelector((state) => state.currentSong.track);

  const dispatch = useDispatch();

  const togglePlayPause = (id) =>
    playOrToggle(dispatch, {
      isSameTrack: track.id === id,
      isPlaying,
      track: props.album,
    });

  return (
    <Col className="AlbumCard">
      <Card>
        <Card.Body>
          <div className="img-container">
            {/* The title below links to the same album, so this link is
                kept out of the tab order and away from screen readers. */}
            <Link
              to={
                "/Album/" +
                (props.source === "home"
                  ? props.album.album.id
                  : props.album.id)
              }
              aria-hidden="true"
              tabIndex={-1}
            >
              {/* The browser picks the 250px or the 500px cover for the
                  card's width; `src` is for browsers without `srcset`. */}
              <Card.Img
                src={cover.cover_big}
                srcSet={
                  cover.cover_medium &&
                  `${cover.cover_medium} 250w, ${cover.cover_big} 500w`
                }
                sizes={COVER_SIZES}
                loading={props.eager ? "eager" : "lazy"}
                decoding="async"
                alt=""
              />
            </Link>
            {/* Only a track can be played: on the artist page the card
                shows an album, which has nothing to play. */}
            {props.source === "home" && (
              <button
                type="button"
                className="play-btn icon-btn"
                aria-label={`${
                  isPlaying && track.id === props.album.id ? "Pause" : "Play"
                } ${props.album.title}`}
                onClick={() => togglePlayPause(props.album.id)}
                disabled={!props.album.preview}
                title={props.album.preview ? undefined : NO_PREVIEW}
                style={{
                  opacity:
                    isPlaying && track.id === props.album.id ? 1 : undefined,
                }}
              >
                <svg
                  aria-hidden="true"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                >
                  {isPlaying && track.id === props.album.id ? (
                    <path fill="white" d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                  ) : (
                    <path fill="white" d="M4.018 14L14.41 8 4.018 2z"></path>
                  )}
                  {/* <polygon
                  points="21.57 12 5.98 3 5.98 21 21.57 12"
                  fill="white"
                ></polygon> */}
                </svg>
              </button>
            )}
          </div>
          <Link
            to={
              "/Album/" +
              (props.source === "home" ? props.album.album.id : props.album.id)
            }
          >
            <Card.Title>
              {props.album.title || props.album.album.title}
            </Card.Title>
          </Link>
          {props.album.artist && (
            <Link to={"/Artist/" + props.album.artist.id}>
              <Card.Subtitle>{props.album.artist.name}</Card.Subtitle>
            </Link>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AlbumCard;
