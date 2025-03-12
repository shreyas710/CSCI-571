import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { user, isLoggedIn, logout, setUser } = useAuth();

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
            {!isLoggedIn && (
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
            )}
            {!isLoggedIn && (
              <div className='me-4'>
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
            )}
            {isLoggedIn && (
              <div className='me-2'>
                {currentPath == "/login" ? (
                  <Button style={{ backgroundColor: "rgb(0, 66, 133)" }}>
                    Favorites
                  </Button>
                ) : (
                  <Nav.Link as={Link} to='/login' className='fw-medium'>
                    Favorites
                  </Nav.Link>
                )}
              </div>
            )}
            {isLoggedIn && (
              <div className='me-4'>
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user!.pic}
                        alt={user!.name}
                        style={{
                          marginRight: "10px",
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                        }}
                      />
                      {user!.name}
                    </>
                  }
                  id='basic-nav-dropdown'>
                  <NavDropdown.Item className='text-danger me-3'>
                    Delete account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className='text-primary me-3'
                    onClick={() => {
                      console.log("Logging out");
                      setUser(null);
                      logout();
                    }}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
