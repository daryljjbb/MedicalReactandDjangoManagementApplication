import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import useAuth from "../hooks/useAuth";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
      window.location.reload(); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container fluid>
        <Navbar.Brand href="/">
          MedicalSystem {isAdmin && <span className="badge bg-danger ms-2">Admin</span>}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Mobile-only nav links (since sidebar hides on mobile) */}
            <Nav.Item>
              <LinkContainer to="/patients">
                <Nav.Link className="text-white">Patients</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
          
          <Nav>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;