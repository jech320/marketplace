import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import WalletInfo from './WalletInfo';
import Wallet from './../../models/Wallet';

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
    const wallet = new Wallet();
    this.state = {
      wallet
    };
    
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <WalletInfo wallet={this.state.wallet} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(GenerateWallet);