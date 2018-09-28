import React from "react";
import { Panel, Image, Button } from "react-bootstrap";

const styles = {
  itemImage: {
    height: "150px",
    width: "250px"
  },
  text: {
    textAlign: "left"
  }
};

const ItemForSaleView = props => (
  <Panel>
    <Panel.Heading>
      <Panel.Title style={styles.text}>
        <h3>{props.item.name}</h3>
      </Panel.Title>
    </Panel.Heading>
    <Panel.Body>
      <p>
        <Image
          src={`https://ipfs.io/ipfs/${props.item.imageIpfsHashes[0]}`}
          style={styles.itemImage}
          rounded
          responsive
        />
      </p>
      <h4 style={styles.text}>Description:</h4>
      <p style={styles.text}>{props.item.description}</p>
      <h4 style={styles.text}>Price: {props.item.price} wei</h4>
    </Panel.Body>
    <Panel.Footer>
      {sessionStorage.getItem("userRole") === "Seller" && (
        <div>
          <Button
            bsStyle="info"
            block
            onClick={() => props.handleUpdateItem(props.index)}
          >
            Update
          </Button>
          <Button
            bsStyle="danger"
            block
            onClick={() => props.handleDeleteItem(props.index)}
          >
            Delete
          </Button>
        </div>
      )}
      {["Buyer", "Owner"].indexOf(sessionStorage.getItem("userRole")) !== -1 && (
        <div>
          <Button
            bsStyle="primary"
            block
            onClick={() => props.handlePurchase(props.item)}
          >
            Purchase
          </Button>
        </div>
      )}
    </Panel.Footer>
  </Panel>
);

export default ItemForSaleView;
