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
import Wallet from "./../../models/Wallet";
import ItemForSaleView from "./../dumb/ItemForSaleView";
import ItemForSaleFormModal from "../dumb/modals/ItemForSaleFormModal";

const styles = {
  item: {
    display: "inline"
  }
};

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      newItem: {
        name: "",
        description: "",
        price: "",
        imgHash: "",
        imgBuffer: []
      },
      itemIndexSelected: undefined,
      itemModalAction: "",
      isItemModalVisible: false
    };
    this.handleAddItemModal = this.handleAddItemModal.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleCancelModal = this.handleCancelModal.bind(this);
    this.handleAddItemInputChange = this.handleAddItemInputChange.bind(this);
    this.handleAddItemImageChange = this.handleAddItemImageChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadItemsForSale = this.loadItemsForSale.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
    this.handleUpdateItemModal = this.handleUpdateItemModal.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  async componentDidMount() {
    await this.loadItemsForSale();
  }

  async loadItemsForSale() {
    const { privateKey, address } = getWallet();
    const contract = getContract(privateKey);

    const itemForSaleCount = await contract.getItemForSaleCount(address);

    const items = [];
    for (let itemIndex = 0; itemIndex < itemForSaleCount; itemIndex++) {
      const itemForSaleImageCount = await contract.getItemForSaleImageCount(
        address,
        itemIndex
      );
      const itemArr = await contract.getItemForSale(address, itemIndex);
      const item = {
        name: itemArr[0],
        description: itemArr[1],
        price: itemArr[2].toString(),
        imageIpfsHashes: []
      };

      for (let imgIndex = 0; imgIndex < itemForSaleImageCount; imgIndex++) {
        const imgHash = await contract.getItemForSaleImage(
          address,
          itemIndex,
          imgIndex
        );
        item.imageIpfsHashes.push(imgHash);
      }

      items.push(item);
    }

    this.setState({ items });
  }

  handleAddItemInputChange(fieldName) {
    return event => {
      this.setState({
        newItem: {
          ...this.state.newItem,
          [fieldName]: event.target.value
        }
      });
    };
  }

  handleAddItemImageChange(event) {
    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const imgBuffer = await Buffer.from(reader.result);

      this.setState({
        newItem: {
          ...this.state.newItem,
          imgBuffer
        }
      });
    };
  }

  handleAddItem() {
    this.setState({
      itemModalAction: "Add",
      isItemModalVisible: true
    });
  }

  async handleAddItemModal() {
    const { name, description, price, imgBuffer } = this.state.newItem;
    const itemPrice = Number(price);

    if (name && description && itemPrice && imgBuffer.length >= 1) {
      const uploadResult = await uploadImage(imgBuffer);
      const imgHash = uploadResult[0].hash;

      const { privateKey, address } = getWallet();
      const contract = getContract(privateKey);

      const tx = await contract.addItemForSale(name, description, price);
      const minedTx = await ropstenProvider.waitForTransaction(tx.hash);
      const itemForSaleCount = await contract.getItemForSaleCount(address);
      const itemIndex = itemForSaleCount.toNumber() - 1;
      const tx2 = await contract.addImageForItemForSale(itemIndex, imgHash);
      const minedTx2 = await ropstenProvider.waitForTransaction(tx2.hash);

      await this.loadItemsForSale();
    }

    this.closeModal();
  }

  async handleUpdateItem(itemIndex) {
    const { privateKey, address } = getWallet();
    const contract = getContract(privateKey);
    console.log(ropstenProvider)
    const itemArr = await contract.getItemForSale(address, itemIndex);
    const imgHash = await contract.getItemForSaleImage(address, itemIndex, 0);

    this.setState({
      itemModalAction: "Update",
      isItemModalVisible: true,
      itemIndexSelected: itemIndex,
      newItem: {
        name: itemArr[0],
        description: itemArr[1],
        price: itemArr[2],
        imgHash
      }
    });
  }

  async handleUpdateItemModal() {
    const { name, description, price, imgBuffer } = this.state.newItem;
    const { itemIndexSelected } = this.state;
    const itemPrice = Number(price);
    const { privateKey, address } = getWallet();
    const contract = getContract(privateKey);
    let imgHash;

    if (name && description && itemPrice) {
      if (imgBuffer && imgBuffer.length >= 1) {
        const uploadResult = await uploadImage(imgBuffer);
        imgHash = uploadResult[0].hash;
        const tx = await contract.removeItemForSaleImage(itemIndexSelected, 0);
        const minedTx = await ropstenProvider.waitForTransaction(tx.hash);
        const tx2 = await contract.addImageForItemForSale(itemIndexSelected, imgHash);
        const minedTx2 = await ropstenProvider.waitForTransaction(tx2.hash);
      }

      const tx = await contract.updateItemForSale(
        itemIndexSelected,
        name,
        description,
        itemPrice
      );
      const minedTx = await ropstenProvider.waitForTransaction(tx.hash);

      await this.loadItemsForSale();
    }

    this.closeModal();
  }

  async handleDeleteItem(itemIndex) {
    const { privateKey } = getWallet();
    const contract = getContract(privateKey);

    const tx = await contract.removeItemForSaleBySeller(itemIndex);
    const minedTx = await ropstenProvider.waitForTransaction(tx.hash);

    await this.loadItemsForSale();

    this.closeModal();
  }

  handleCancelModal() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isItemModalVisible: false,
      newItem: {
        name: "",
        description: "",
        price: "",
        imgHash: "",
        imgBuffer: []
      }
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Panel>
              <Panel.Heading>
                <Panel.Title>
                  <Button
                    bsSize="lg"
                    bsStyle="primary"
                    block
                    onClick={this.handleAddItem}
                  >
                    Add
                  </Button>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <Form inline>
                  {this.state.items.map((item, index) => (
                    <div style={styles.item} key={index}>
                      <FormGroup>
                        <ItemForSaleView
                          index={index}
                          item={item}
                          handleUpdateItem={this.handleUpdateItem}
                          handleDeleteItem={this.handleDeleteItem}
                        />
                      </FormGroup>
                      {"  "}
                    </div>
                  ))}
                </Form>
              </Panel.Body>
            </Panel>
            <ItemForSaleFormModal
              action={this.state.itemModalAction}
              newItem={this.state.newItem}
              handleAddItemImageChange={this.handleAddItemImageChange}
              handleAddItemInputChange={this.handleAddItemInputChange}
              isItemModalVisible={this.state.isItemModalVisible}
              handleAddItemModal={this.handleAddItemModal}
              handleUpdateItemModal={this.handleUpdateItemModal}
              handleCancelModal={this.handleCancelModal}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Inventory);
