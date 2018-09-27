import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import {
  Grid,
  Row,
  Col,
  Button,
  Alert,
  Glyphicon
} from 'react-bootstrap';
import EthersClient from './../../models/EthersClient';
import Wallet from './../../models/Wallet';

const styles = {
  alert: {
    wordWrap: 'break-word'
  }
};

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
    const wallet = new Wallet();
    this.state = {
      copyMessage: '',
      wallet
    };
    this.copySecretKey = this.copySecretKey.bind(this);
    this.copyAddress = this.copyAddress.bind(this);
  }

  copySecretKey() {
    copy(this.state.wallet.privateKey);
    
    this.setState({
      copyMessage: 'Successfully copied secret key'
    });
  }

  copyAddress() {
    copy(this.state.wallet.address);

    this.setState({
      copyMessage: 'Successfully copied address'
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Alert bsStyle="success" style={styles.alert}>
              <Grid>
                <Row>
                  <Col md={12}>
                    <h4>
                    Secret Key: {this.state.wallet.privateKey}
                    <span> </span>
                    <Button onClick={this.copySecretKey}>
                      <Glyphicon glyph="glyphicon glyphicon-duplicate" />
                    </Button>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4>
                    Address: {this.state.wallet.address}
                    <span> </span>
                    <Button onClick={this.copyAddress}>
                      <Glyphicon glyph="glyphicon glyphicon-duplicate" />
                    </Button>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4>{this.state.copyMessage}</h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button bsStyle="info">Proceed to Login</Button>
                  </Col>
                </Row>
              </Grid>
            </Alert>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(GenerateWallet);