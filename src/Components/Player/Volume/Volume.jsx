import { Row } from "react-bootstrap";
import "./Volume.css";

const Volume = () => {
  return (
    <Row className="Volume justify-content-end align-items-center h-100">
      {/* <Col> */}
      <div className="d-none d-md-flex">
        <span
          aria-hidden="true"
          // class="IconWrapper__Wrapper-sc-16usrgb-0 eFbhGd"
        >
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            // class="Svg-sc-1bi12j5-0 gSLhUO"
          >
            <path
              // fill="white"
              d="M2 2v5l4.33-2.5L2 2zm0 12h14v-1H2v1zm0-4h14V9H2v1zm7-5v1h7V5H9z"
            ></path>
          </svg>
        </span>
      </div>
      {/* </Col> */}
      {/* <Col> */}
      <div className="d-none d-md-flex">
        <span>
          <svg
            role="img"
            height="16"
            width="16"
            aria-label="Connect to a device"
            viewBox="0 0 16 16"
            // class="Svg-sc-1bi12j5-0 gSLhUO"
          >
            <path d="M0 3v8c0 .55.45 1 1 1h5v-1H1V3h5V2H1c-.55 0-1 .45-1 1zm3 11.5c0 .275.225.5.5.5H6v-1H3.5c-.275 0-.5.225-.5.5zM15 2H9c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H9V3h6v11zm-3-8a.75.75 0 100-1.5.75.75 0 000 1.5zm0 6a2 2 0 100-4 2 2 0 000 4zm0-3c.551 0 1 .449 1 1s-.449 1-1 1-1-.449-1-1 .449-1 1-1z"></path>
          </svg>
        </span>
      </div>
      {/* </Col> */}
      {/* <div> */}
      <div>
        <svg
          role="presentation"
          height="16"
          width="16"
          aria-label="Volume high"
          id="volume-icon"
          viewBox="0 0 16 12"
          // class="Svg-sc-1bi12j5-0 gSLhUO"
        >
          <path
            // fill="white"
            d="M12.945 1.379l-.652.763c1.577 1.462 2.57 3.544 2.57 5.858s-.994 4.396-2.57 5.858l.651.763a8.966 8.966 0 00.001-13.242zm-2.272 2.66l-.651.763a4.484 4.484 0 01-.001 6.397l.651.763c1.04-1 1.691-2.404 1.691-3.961s-.65-2.962-1.69-3.962zM0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732z"
          ></path>
        </svg>
      </div>
      <div className="volume-bar"></div>
      {/* </div> */}
    </Row>
  );
};

export default Volume;
