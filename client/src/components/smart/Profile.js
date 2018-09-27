import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h1>Profile</h1>
    );
  }
}

export default withRouter(Profile);