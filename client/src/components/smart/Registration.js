import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h1>registration</h1>
    );
  }
}

export default withRouter(Registration);