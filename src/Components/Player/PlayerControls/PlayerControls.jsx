import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./PlayerControls.css";

const PlayerControls = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation of progress bar

  const onLoadedMetadata = () => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  };

  // useEffect(() => {
  //   const seconds = Math.floor(audioPlayer.current.duration);
  //   setDuration(seconds);
  //   progressBar.current.max = seconds;
  // }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (!audioPlayer.current.ended) {
      progressBar.current.value = audioPlayer.current.currentTime;
      animationRef.current = requestAnimationFrame(whilePlaying);
      changePlayerCurrentTime();
    } else {
      setIsPlaying(false);
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    setCurrentTime(progressBar.current.value);
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
  };

  const backfive = () => {
    progressBar.current.value = parseInt(progressBar.current.value) - 5;
    changeRange();
  };

  const forwardfive = () => {
    progressBar.current.value = parseInt(progressBar.current.value) + 5;
    changeRange();
  };

  return (
    <>
      <Row className="PlayerControls flex-column justify-content-center align-items-center">
        <audio
          ref={audioPlayer}
          src="https://cdns-preview-a.dzcdn.net/stream/c-a840ca0ecb57afc73f45fb4114beb724-4.mp3"
          preload="metadata"
          onLoadedMetadata={onLoadedMetadata}
        ></audio>
        <Row className="player-buttons w-100 mb-sm-2">
          <Col className="d-flex justify-content-end p-0">
            <div>
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                // class="Svg-sc-1bi12j5-0 gSLhUO"
              >
                <path
                  //   fill="#b3b3b3"
                  d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z"
                ></path>
              </svg>
            </div>
            <div onClick={backfive}>
              <svg role="img" height="16" width="16" viewBox="0 0 16 16">
                <path
                  //   fill="#b3b3b3"
                  d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"
                ></path>
              </svg>
            </div>
          </Col>
          <Col className="col-play d-flex justify-content-center p-0">
            <div className="play" onClick={togglePlayPause}>
              <svg role="img" height="16" width="16" viewBox="0 0 16 16">
                {isPlaying ? (
                  <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                ) : (
                  <path d="M4.018 14L14.41 8 4.018 2z"></path>
                )}
              </svg>
            </div>
          </Col>
          <Col className="d-flex justify-content-start p-0">
            <div onClick={forwardfive}>
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                // class="Svg-sc-1bi12j5-0 gSLhUO"
              >
                <path
                  //   fill="#b3b3b3"
                  d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"
                ></path>
              </svg>
            </div>
            <div>
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                // class="Svg-sc-1bi12j5-0 gSLhUO"
              >
                <path
                  //   fill="#b3b3b3"
                  d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"
                ></path>
              </svg>
            </div>
          </Col>
        </Row>
        <Row className="Progress-Bar d-none d-sm-flex">
          <Col sm={2} className="text-end p-0">
            <span>{calculateTime(currentTime)} </span>
          </Col>
          <Col>
            <div>
              <input
                type="range"
                className="bar"
                defaultValue="0"
                ref={progressBar}
                onChange={changeRange}
                step="0.05"
              />
            </div>
          </Col>
          <Col sm={2} className="text-start p-0">
            <span>{!isNaN(duration) && calculateTime(duration)}</span>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default PlayerControls;
