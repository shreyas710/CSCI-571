import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import './navbar.css'

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const { user, isLoggedIn, logout, setUser } = useAuth();

  const { notifications, setNotifications } = useNotifications();

  function deleteCookie(name: string) {
    document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }

  async function deleteUser() {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        setUser(null);
        logout();
        setNotifications([
          ...notifications,
          {
            message: "Account deleted",
            backgroundColor: "rgb(249, 210, 214)",
            textColor: "text-danger",
            show: true,
          },
        ]);
        deleteCookie("userToken");
        navigate("/");
      } else {
        console.log("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }

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
                <Button
                  style={{
                    backgroundColor: "rgb(0, 66, 133)",
                    width: "100%",
                    textAlign: "left",
                  }}>
                  Search
                </Button>
              ) : (
                <Nav.Link
                  as={Link}
                  to='/'
                  className='fw-medium'
                  style={{ marginLeft: "10px" }}>
                  Search
                </Nav.Link>
              )}
            </div>
            {!isLoggedIn && (
              <div className='me-4'>
                {currentPath == "/login" ? (
                  <Button
                    style={{
                      backgroundColor: "rgb(0, 66, 133)",
                      width: "100%",
                      textAlign: "left",
                    }}>
                    Log in
                  </Button>
                ) : (
                  <Nav.Link
                    as={Link}
                    to='/login'
                    className='fw-medium'
                    style={{ marginLeft: "10px" }}>
                    Log in
                  </Nav.Link>
                )}
              </div>
            )}
            {!isLoggedIn && (
              <div className='me-4'>
                {currentPath == "/register" ? (
                  <Button
                    style={{
                      backgroundColor: "rgb(0, 66, 133)",
                      width: "100%",
                      textAlign: "left",
                    }}>
                    Register
                  </Button>
                ) : (
                  <Nav.Link
                    as={Link}
                    to='/register'
                    className='fw-medium'
                    style={{ marginLeft: "10px" }}>
                    Register
                  </Nav.Link>
                )}
              </div>
            )}
            {isLoggedIn && (
              <div className='me-4'>
                {currentPath == "/favorites" ? (
                  <Button
                    style={{
                      backgroundColor: "rgb(0, 66, 133)",
                      width: "100%",
                      textAlign: "left",
                    }}>
                    Favorites
                  </Button>
                ) : (
                  <Nav.Link
                    as={Link}
                    to='/favorites'
                    className='fw-medium'
                    style={{ marginLeft: "10px" }}>
                    Favorites
                  </Nav.Link>
                )}
              </div>
            )}
            {isLoggedIn && (
              <div style={{ marginLeft: "10px", marginRight: `${user!.name.length < 8 ? "50px" : "0px"}` }} className="navbarDropdown">
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
                          backgroundColor: "gray",
                          color: "black",
                        }}
                      />
                      {user!.name}
                    </>
                  }
                  id='basic-nav-dropdown'>
                  <NavDropdown.Item
                    onClick={() => deleteUser()}
                    className='text-danger me-3'>
                    Delete account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className='text-primary me-3'
                    onClick={() => {
                      setUser(null);
                      logout();
                      setNotifications([
                        ...notifications,
                        {
                          message: "Logged out",
                          backgroundColor: "rgb(203,226,216)",
                          textColor: "text-success",
                          show: true,
                        },
                      ]);
                      deleteCookie("userToken");
                      navigate("/");
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
