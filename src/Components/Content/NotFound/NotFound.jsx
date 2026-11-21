import { Container } from "react-bootstrap";
import { Link } from "react-router";
import "./NotFound.css";

// Shown for any address no route matches.
const NotFound = () => (
  <Container fluid className="NotFound p-4">
    <h1>Page not found</h1>
    <p>There is nothing at this address.</p>
    <Link to="/">Back to Home</Link>
  </Container>
);

export default NotFound;
