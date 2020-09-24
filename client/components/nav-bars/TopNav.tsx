import React from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button
} from "react-bootstrap";
import logo from "../../../public/lucidQL-logo.png";
import logoBrand from "../../../public/lucidQL.png";

const TopNav: React.FC = ({ showModal }) => {
  function openNav() {
    document.querySelector("#mySidebar").style.width = "250px";
    document.querySelector("#main").style.marginLeft = "250px";
  }

  return (
    <Navbar
      className="sticky-nav text-secondary"
      collapseOnSelect
      expand="lg"
      bg="white"
      variant="white"
    >
      <button className="openbtn bg-white" onClick={openNav}>
        ☰
      </button>
      <img className="logo" src={logo} />
      <Navbar.Brand className="logo-text">
        <img className="logo-brand" src={logoBrand} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Form inline>
            <Button
              className="openLinkModal"
              id="postgresURIbutton"
              variant="light"
              onClick={showModal}
            >
              Enter Postgres URI
            </Button>
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;

/*                */
