import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid, Col, Row } from "react-bootstrap";
import ethers from "ethers";
import { getContract, getWallet, ropstenProvider } from "./../../utils/main";
import EthersClient from "./../../models/EthersClient";
import Wallet from "./../../models/Wallet";
import ProfileForm from "./../dumb/forms/ProfileForm";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      isUpdating: false,
      contact: {
        email: "",
        number: ""
      },
      commission: 0
    };
    this.handleContactInputChange = this.handleContactInputChange.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleWithdrawCommission = this.handleWithdrawCommission.bind(this);
    this.getCommission = this.getCommission.bind(this);
  }

  async componentDidMount() {
    const { privateKey, address } = getWallet();
    const userRole = sessionStorage.getItem("userRole");
    const wallet = new ethers.Wallet(privateKey, ropstenProvider);
    const contract = getContract(privateKey);
    let email, number;

    if (userRole !== "Owner") {
      const contact = await contract.getSellerContact(address);
      email = contact[0];
      number = contact[1];
    }

    const balanceBigNum = await wallet.getBalance();
    const { utils } = ethers;
    const parseBalance = balanceBigNum =>
      parseFloat(utils.formatEther(balanceBigNum));
    const balance = parseBalance(balanceBigNum);

    ropstenProvider.on(address, newBalance => {
      this.setState({
        balance: parseBalance(newBalance)
      });
    });

    let commission;
    if (userRole === "Owner") {
      commission = await this.getCommission();
    }

    this.setState({
      balance,
      wallet,
      commission,
      contact: {
        email,
        number
      }
    });
  }

  handleContactInputChange(fieldName) {
    return event => {
      this.setState({
        contact: {
          ...this.state.contact,
          [fieldName]: event.target.value
        }
      });
    };
  }

  async handleConfirm() {
    const { email, number } = this.state.contact;
    const { privateKey } = this.state.wallet;
    const contract = getContract(privateKey);
    const tx = await contract.updateContact(email, number);

    const minedTx = await ropstenProvider.waitForTransaction(tx.hash);

    this.setState({
      contact: {
        email,
        number
      },
      isUpdating: false
    });
  }

  handleCancel() {
    this.setState({
      isUpdating: false
    });
  }

  handleUpdateProfile() {
    this.setState({
      isUpdating: true
    });
  }

  async handleWithdrawCommission() {
    const { privateKey } = this.state.wallet;
    const contract = getContract(privateKey);

    const tx = await contract.cashoutCommission();
    const minedTx = await ropstenProvider.waitForTransaction(tx.hash);

    this.setState({
      commission: 0
    });
  }

  async getCommission() {
    const utils = ethers.utils;
    const { privateKey } = getWallet();
    const contract = getContract(privateKey);

    const commissionBigNum = await contract.viewCommission();
    const commission = commissionBigNum.toNumber();

    return utils.formatEther(commission);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xsOffset={1} xs={10} smOffset={2} sm={8} mdOffset={3} md={6}>
            <ProfileForm
              commission={this.state.commission}
              handleContactInputChange={this.handleContactInputChange}
              handleUpdateProfile={this.handleUpdateProfile}
              handleConfirm={this.handleConfirm}
              handleCancel={this.handleCancel}
              balance={this.state.balance}
              isUpdating={this.state.isUpdating}
              contact={this.state.contact}
              handleWithdrawCommission={this.handleWithdrawCommission}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Profile);
