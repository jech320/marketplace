import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
import { getContract, ropstenProvider } from './../../utils/main';
import EthersClient from './../../models/EthersClient';
import RegistrationForm from './../dumb/forms/RegistrationForm';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      email: '',
      contactNumber: '',
      roleName: '',
      roles: {
        buyer: 0,
        seller: 1
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleInputChange(fieldName) {
    return (event) => {
      this.setState({
        [fieldName]: event.target.value
      });
    }
  }

  handleSelectChange(event) {
    this.setState({
      roleName: event.target.value
    });
  }

  async handleRegister() {
    const { privateKey, email, contactNumber, roleName, roles } = this.state;
    const contract = getContract(privateKey);

    const tx = await contract.registerUser(roles[roleName], email, contactNumber);
    const minedTx = await ropstenProvider.waitForTransaction(tx.hash);
    console.log(minedTx);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col
            xsOffset={2} xs={8}
            smOffset={3} sm={6}
            mdOffset={4} md={4}
          >
            <RegistrationForm
              handleInputChange={this.handleInputChange}
              handleRegister={this.handleRegister}
              handleSelectChange={this.handleSelectChange}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Registration);