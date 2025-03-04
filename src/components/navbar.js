import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">My Blockchain</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">User</Nav.Link>
            <Nav.Link as={Link} to="/Quest">Quest</Nav.Link>
            <Nav.Link as={Link} to="/loginAd">Admin</Nav.Link>
            <Nav.Link as={Link} to="/upload">Upload Image</Nav.Link>
            <Nav.Link as={Link} to="/navigate">Navigate</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
