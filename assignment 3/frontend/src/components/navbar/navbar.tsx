import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function NavBar() {
  const [selectedTab, setSelectedTab] = useState("search");

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container fluid>
        <Navbar.Brand href='/'>Artist Search</Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto my-2 my-lg-0' navbarScroll></Nav>
          <Nav navbarScroll>
            <div className='me-4'>
              {selectedTab == "search" ? (
                <Button>Search</Button>
              ) : (
                <Nav.Link
                  as={Link}
                  to='/'
                  className='fw-medium'
                  onClick={() => setSelectedTab("search")}>
                  Search
                </Nav.Link>
              )}
            </div>
            <div className='me-4'>
              {selectedTab == "login" ? (
                <Button>Log in</Button>
              ) : (
                <Nav.Link
                  as={Link}
                  to='/login'
                  className='fw-medium'
                  onClick={() => setSelectedTab("login")}>
                  Log in
                </Nav.Link>
              )}
            </div>
            <div className='me-5'>
              {selectedTab == "register" ? (
                <Button>Register</Button>
              ) : (
                <Nav.Link
                  as={Link}
                  to='/register'
                  className='fw-medium'
                  onClick={() => setSelectedTab("register")}>
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
