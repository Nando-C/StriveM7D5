import { Col, Container, Form, Row } from "react-bootstrap";
import "./Search.css";

const Search = () => {
  return (
    <Container className="Search">
      <Row>
        <Col sm={9} className="form-container">
          <Form>
            <Form.Control placeholder="Artists, songs, or podcasts" />
            <div className="search-icon">
              <span>
                <svg
                  role="img"
                  height="24"
                  width="24"
                  class="Svg-sc-1bi12j5-0 gSLhUO _pxQadHFO3vmadLs8OPr"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path>
                </svg>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
