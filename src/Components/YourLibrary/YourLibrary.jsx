import { Button, Container, Row } from "react-bootstrap";
import "./YourLibrary.css";

const YourLibrary = () => {
  return (
    <Container className="YourLibrary">
      <Row className="flex-column text-center">
        <div>
          <svg
            width="80"
            height="81"
            viewBox="0 0 80 81"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Playlist Icon</title>
            <path
              d="M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z"
              fill="white"
              //   fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <h2>Create your first playlist</h2>
        <span>It's easy, we'll help you.</span>
        <div>
          <Button variant="light">CREATE PLAYLIST</Button>
        </div>
      </Row>
    </Container>
  );
};

export default YourLibrary;
