import NavigationBar from "./Navbar";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom"; // Add this

export default function Layout() {
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Row>
          {/* SIDEBAR */}
          <Col md={2} className="">
            <Nav className="flex-column p-2">
              <LinkContainer to="/patients">
                <Nav.Link>Patients</Nav.Link>
              </LinkContainer>
              {/* ... other links */}
            </Nav>
          </Col>

          {/* MAIN CONTENT AREA */}
          <Col md={10} className="p-4">
            {/* This is where your Invoices or Patients pages will appear */}
            <Outlet /> 
          </Col>
        </Row>
      </Container>
    </>
  );
}