import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid, Row, Col } from "react-bootstrap";
import { getContract, ropstenProvider } from "./../../utils/main";
import EthersClient from "./../../models/EthersClient";
import Wallet from "./../../models/Wallet";
import LoginForm from "./../dumb/forms/LoginForm";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: "",
      roles: ["Buyer", "Seller"]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInputChange(fieldName) {
    return event => {
      this.setState({
        [fieldName]: event.target.value
      });
    };
  }

  async handleLogin() {
    const { privateKey } = this.state;
    const wallet = Wallet.recoverFromPrivateKey(privateKey);
    const contract = getContract(privateKey);

    const owner = await contract.owner();

    if (wallet.address === owner) {
      sessionStorage.setItem("userRole", "Owner");
      sessionStorage.setItem("wallet", JSON.stringify(wallet));
      this.props.history.push("/");
    }

    const userAddressIndicesCount = await contract.getUserAddressIndicesCount();

    for (let index = 0; index < userAddressIndicesCount; index++) {
      const address = await contract.getUserAddress(index);

      if (wallet.address === address) {
        const roleBigNum = await contract.getRole();
        const roleIndex = roleBigNum.toNumber();
        const role = this.state.roles[roleIndex];

        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("wallet", JSON.stringify(wallet));
        this.props.history.push("/");
      }
    }
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xsOffset={2} xs={8} smOffset={3} sm={6} mdOffset={4} md={4}>
            <LoginForm
              handleInputChange={this.handleInputChange}
              handleLogin={this.handleLogin}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Login);
