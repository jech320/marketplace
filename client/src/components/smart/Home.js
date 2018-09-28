import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Row,
  Col,
  Panel,
  Button,
  Form,
  FormGroup
} from "react-bootstrap";
import {
  getContract,
  uploadImage,
  getWallet,
  ropstenProvider
} from "./../../utils/main";
import Wallet from './../../models/Wallet';
import ItemForSaleView from "./../dumb/ItemForSaleView";

const styles = {
  item: {
    display: "inline"
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.loadItemsForSale = this.loadItemsForSale.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
  }

  async componentDidMount() {
    await this.loadItemsForSale();
  }

  async loadItemsForSale() {
    let privateKey;

    try {
      privateKey = getWallet().privateKey;
    } catch (error) {
      privateKey = new Wallet().privateKey;
    }
    const contract = getContract(privateKey);

    const userAddressIndicesCountBigNum = await contract.getUserAddressIndicesCount();
    const userAddressIndicesCount = userAddressIndicesCountBigNum.toNumber();

    const items = [];
    for (
      let userAddressIndex = 0;
      userAddressIndex < userAddressIndicesCount;
      userAddressIndex++
    ) {
      const sellerAddress = await contract.getUserAddress(userAddressIndex);
      const itemForSaleCount = await contract.getItemForSaleCount(
        sellerAddress
      );

      for (let itemIndex = 0; itemIndex < itemForSaleCount; itemIndex++) {
        const itemForSaleImageCount = await contract.getItemForSaleImageCount(
          sellerAddress,
          itemIndex
        );
        const itemArr = await contract.getItemForSale(sellerAddress, itemIndex);
        const item = {
          sellerAddress,
          index: itemIndex,
          name: itemArr[0],
          description: itemArr[1],
          price: itemArr[2].toString(),
          imageIpfsHashes: []
        };

        for (let imgIndex = 0; imgIndex < itemForSaleImageCount; imgIndex++) {
          const imgHash = await contract.getItemForSaleImage(
            sellerAddress,
            itemIndex,
            imgIndex
          );
          item.imageIpfsHashes.push(imgHash);
        }

        items.push(item);
      }
    }

    this.setState({ items });
  }

  async handlePurchase(item) {
    const { sellerAddress, index, price } = item;
    const { privateKey, address } = getWallet();
    const contract = getContract(privateKey);
    console.log(item)
    console.log(contract)
    const tx = await contract.purchaseItem(sellerAddress, index, {
      value: Number(price)
    });
    console.log(tx)
    const minedTx = await ropstenProvider.waitForTransaction(tx.hash);
    console.log(minedTx);
    await this.loadItemsForSale();
    console.log('loaded');
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Panel>
              <Panel.Body>
                <Form inline>
                  {this.state.items.map((item, index) => (
                    <div style={styles.item} key={index}>
                      <FormGroup>
                        <ItemForSaleView
                          index={index}
                          item={item}
                          handleUpdateItem={() => {}}
                          handleDeleteItem={() => {}}
                          handlePurchase={this.handlePurchase}
                        />
                      </FormGroup>
                      {"  "}
                    </div>
                  ))}
                </Form>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Home);
