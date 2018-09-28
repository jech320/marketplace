import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, withRouter } from "react-router-dom";

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
    this.state = {};
  }

  render() {
    const wallet = window.sessionStorage.getItem('wallet');
    const userRole = window.sessionStorage.getItem('userRole');
    
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
            {
              !wallet &&
              <NavItem>
                <Link style={styles.navItem} to="/login">
                Login
                </Link>
              </NavItem>
            }
            {
              !wallet &&
              <NavItem>
                <Link style={styles.navItem} to="/register">
                Register
                </Link>
              </NavItem>
            }
            {
              !wallet &&
              <NavItem>
                <Link style={styles.navItem} to="/generate-wallet">
                Generate Wallet
                </Link>
              </NavItem>
            }
            {
              !wallet &&
              <NavItem>
                <Link style={styles.navItem} to="/recover-wallet">
                Recover Wallet
                </Link>
              </NavItem>
            }
            {
              userRole === 'Seller' &&
              <NavItem>
                <Link style={styles.navItem} to="/inventory">
                Inventory
                </Link>
              </NavItem>
            }
            {
              wallet &&
              <NavItem>
                <Link style={styles.navItem} to="/profile">
                Profile
                </Link>
              </NavItem>
            }
            {
              wallet &&
              <NavItem>
                <Link
                  style={styles.navItem}
                  onClick={() => window.sessionStorage.clear()}
                  to="/"
                >
                Logout
                </Link>
              </NavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Navigator);