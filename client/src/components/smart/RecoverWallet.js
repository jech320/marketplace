import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Row,
  Col,
  Alert,
  Form,
  FormGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import Wallet from './../../models/Wallet';
import WalletInfo from './WalletInfo';

class RecoverWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: undefined,
      error: undefined
    };
    this.recoverWallet = this.recoverWallet.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  recoverWallet() {
    const { selectedItem } = this.state;
    let wallet;
    let error;

    if (selectedItem === 'Recover from private key') {
      try {
        wallet = Wallet.recoverFromPrivateKey(this.state.credential);
      } catch(err) {
        error = err;
      }
    } else if (selectedItem === 'Recover from mnemonic') {
      try {
        wallet = Wallet.recoverFromMnemonic(this.state.credential);
      } catch(err) {
        error = err;
      }
    }

    if (wallet) {
      this.setState({
        wallet,
        error: false
      });
    } else {
      this.setState({
        error,
        wallet: undefined
      })
    }
  }

  handleDropdownChange(event) {
    this.setState({
      selectedItem: event.target.value
    });
  }

  handleInputChange(event) {
    this.setState({
      credential: event.target.value
    });
  }

  render() {
    const dropdownOptions = [
      'Select wallet recovery method',
      'Recover from private key',
      'Recover from mnemonic'
    ];

    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Form horizontal>
              <FormGroup>
                <Col xs={4} sm={7} md={8}>
                  <FormControl
                    onChange={this.handleInputChange}
                    placeholder="Credential"
                  />
                </Col>
                <Col xs={8} sm={5} md={4}>
                    <FormControl
                      componentClass="select"
                      onChange={this.handleDropdownChange}
                    >
                      {
                        dropdownOptions.map((option, index) => (
                          <option eventKey={index} key={index} value={option}>
                            {option}
                          </option>
                        ))
                      }
                    </FormControl>
                </Col>
              </FormGroup>
              <Button
                bsStyle="primary"
                bsSize="lg"
                onClick={this.recoverWallet}
                block
              >
              Recover
              </Button>
            </Form>
          </Col>
        </Row>
        <br />
        {
          this.state.wallet &&
          <Row>
            <Col md={12}>
              <WalletInfo wallet={this.state.wallet} />
            </Col>
          </Row>
        }
        {
          this.state.error &&
          <Row>
            <Col md={12}>
              <Alert bsStyle="danger">
              Error: Unable to recover wallet
              </Alert>
            </Col>
          </Row>
        }
      </Grid>
    );
  }
}

export default withRouter(RecoverWallet);