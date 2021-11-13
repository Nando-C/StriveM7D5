import { Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./nowPlaying.css";

const NowPlaying = () => {
  return (
    <Row className="NowPlaying justify-content-start align-items-center">
      <div className="cover-img">
        <Image src="https://picsum.photos/200" fluid />
      </div>
      <div>
        <div className="info-playing">
          <div>
            <span>Everlong</span>
          </div>
          <Link to="">
            <span>
              <small>Foo Fighters</small>
            </span>
          </Link>
        </div>
      </div>
      <div className="like-heart">
        <svg
          role="img"
          height="16"
          width="16"
          viewBox="0 0 16 16"
          class="Svg-sc-1bi12j5-0 fIDrcz"
        >
          <path fill="none" d="M0 0h16v16H0z"></path>
          <path
            fill="#B1B1B1"
            d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z"
          ></path>
        </svg>
      </div>
      <div className="pip-toggle">
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor" fill-rule="evenodd">
            <path
              d="M1 3v9h14V3H1zm0-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
              fill-rule="nonzero"
            ></path>
            <path d="M10 8h4v3h-4z"></path>
          </g>
        </svg>
      </div>
    </Row>
  );
};

export default NowPlaying;
