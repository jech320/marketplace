import React, { Component } from 'react';
import { Navbar, Nav, NavItem, FormGroup, FormControl, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

const styles = {
  navBar: {
    borderRadius: 0,
  },
  navItem: {
    color: '#9d9d9d',
  },
};

class Navigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar style={styles.navBar} inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Marketplace</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem>
              <Link style={styles.navItem} to="/login">
              Login
              </Link>
            </NavItem>
            <NavItem>
              <Link style={styles.navItem} to="/register">
              Register
              </Link>
            </NavItem>
            <NavItem>
              <Link style={styles.navItem} to="/generate-wallet">
              Generate Wallet
              </Link>
            </NavItem>
            <NavItem>
              <Link style={styles.navItem} to="/recover-wallet">
              Recover Wallet
              </Link>
            </NavItem>
            <NavItem>
              <Link style={styles.navItem} to="/profile">
              Profile
              </Link>
            </NavItem>
            <NavItem>
              <Link style={styles.navItem} to="/">
              Logout
              </Link>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Navigator);