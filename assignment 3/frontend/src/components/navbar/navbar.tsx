import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container fluid>
        <Navbar.Brand href='/' className='ms-3 fs-4'>
          Artist Search
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto my-2 my-lg-0' navbarScroll></Nav>
          <Nav navbarScroll>
            <div className='me-4'>
              {currentPath == "/" ? (
                <Button style={{ backgroundColor: "rgb(0, 66, 133)" }}>
                  Search
                </Button>
              ) : (
                <Nav.Link as={Link} to='/' className='fw-medium'>
                  Search
                </Nav.Link>
              )}
            </div>
            <div className='me-4'>
              {currentPath == "/login" ? (
                <Button style={{ backgroundColor: "rgb(0, 66, 133)" }}>
                  Log in
                </Button>
              ) : (
                <Nav.Link as={Link} to='/login' className='fw-medium'>
                  Log in
                </Nav.Link>
              )}
            </div>
            <div className='me-5'>
              {currentPath == "/register" ? (
                <Button style={{ backgroundColor: "rgb(0, 66, 133)" }}>
                  Register
                </Button>
              ) : (
                <Nav.Link as={Link} to='/register' className='fw-medium'>
                  Register
                </Nav.Link>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
