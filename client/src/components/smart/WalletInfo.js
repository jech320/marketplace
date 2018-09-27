import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  Alert,
  Glyphicon,
  Nav
} from 'react-bootstrap';
import copy from 'copy-to-clipboard';

const styles = {
  alert: {
    wordWrap: 'break-word'
  },
  copyMessage: {
    marginTop: '10px'
  }
};

class WalletInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyMessage: undefined,
      wallet: this.props.wallet
    };
    this.copySecretKey = this.copySecretKey.bind(this);
    this.copyAddress = this.copyAddress.bind(this);
    this.copyMnemonic = this.copyMnemonic.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }

  goToLogin() {
    this.props.history.push('/login');
  }

  copySecretKey() {
    copy(this.state.wallet.privateKey);
    
    this.setState({
      copyMessage: 'Successfully copied secret key'
    });
  }

  copyMnemonic() {
    copy(this.state.wallet.mnemonic);
    
    this.setState({
      copyMessage: 'Successfully copied mnemonic'
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
      <Nav>
        <Alert bsStyle="info" style={styles.alert}>
          {
            this.state.wallet.mnemonic &&
            <h4>
              Mnemonic Phrase: {this.state.wallet.mnemonic}
              <span> </span>
              <Button onClick={this.copyMnemonic}>
              <Glyphicon glyph="glyphicon glyphicon-duplicate" />
              </Button>
            </h4>
          }
          <h4>
            Secret Key: {this.state.wallet.privateKey}
            <span> </span>
            <Button onClick={this.copySecretKey}>
            <Glyphicon glyph="glyphicon glyphicon-duplicate" />
            </Button>
          </h4>
          <h4>
            Address: {this.state.wallet.address}
            <span> </span>
            <Button onClick={this.copyAddress}>
            <Glyphicon glyph="glyphicon glyphicon-duplicate" />
            </Button>
          </h4>
          <Button bsStyle="primary" onClick={this.goToLogin} block>
          Proceed to Login
          </Button>
        </Alert>
        {
          this.state.copyMessage && 
          <Row>
            <Col md={12}>
              <Alert bsStyle="success">
                <h2 style={styles.copyMessage}>{this.state.copyMessage}</h2>
              </Alert>
            </Col>
          </Row>
        }
      </Nav>
    );
  }
}

export default withRouter(WalletInfo);