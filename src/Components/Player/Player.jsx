import { Col, Container, Row } from "react-bootstrap";
import NowPlaying from "./NowPlaying/NowPlaying";
import PlayerControls from "./PlayerControls/PlayerControls";
import Volume from "./Volume/Volume";
import "./Player.css";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { selectSong } from "../../redux/slices/currentSong";
import { fetchFreshTrack } from "../../utils/freshTrack";
import { readLastTrack, saveLastTrack } from "../../utils/lastTrack";

const Player = () => {
  const currentSong = useSelector((state) => state.currentSong.track);
  const dispatch = useDispatch();
  const store = useStore();

  // On arrival, load the track this browser played last, paused. It is
  // fetched again, not stored whole: its preview link would have expired.
  useEffect(() => {
    const saved = readLastTrack();
    if (!saved) return;
    let cancelled = false;
    fetchFreshTrack(dispatch, saved).then((track) => {
      // Not if the visitor has already picked something to play.
      if (cancelled || !track || store.getState().currentSong.track.id) return;
      dispatch(selectSong(track));
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch, store]);

  // Remember whichever track is loaded.
  useEffect(() => {
    if (currentSong.id && currentSong.album?.id) saveLastTrack(currentSong);
  }, [currentSong]);

  return (
    <Container as="section" aria-label="Player" className="Player" fluid>
      <Row className="px-3 h-100 align-items-center">
        <Col xs={7} sm={4} lg={3}>
          {currentSong.album?.id && <NowPlaying />}
        </Col>
        <Col xs={5} sm={4} lg={6}>
          <PlayerControls />
        </Col>
        <Col sm={4} lg={3} className="d-none d-sm-block">
          <Volume />
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
