import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h1>generate wallet</h1>
    );
  }
}

export default withRouter(GenerateWallet);