import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RecoverWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h1>recover wallet</h1>
    );
  }
}

export default withRouter(RecoverWallet);