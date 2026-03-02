import NavigationBar from "./Navbar";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavigationBar />
      <Container fluid className="mt-3">
        <Row>
          {/* SIDEBAR */}
          <Col
            md={2}
            className="bg-light vh-100 p-3 shadow-sm d-none d-md-block"
          >
            <Nav className="flex-column p-2">
              <LinkContainer to="/patients">
                <Nav.Link>Patients</Nav.Link>
              </LinkContainer>
               <LinkContainer to="/doctors">
                <Nav.Link>Doctors</Nav.Link>
              </LinkContainer>
              {/* Add more sidebar links here */}
            </Nav>
          </Col>

          {/* MAIN CONTENT */}
          <Col md={10} className="p-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}

