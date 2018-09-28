import React from "react";
import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Image,
  Grid,
  Row,
  Col
} from "react-bootstrap";

const styles = {
  form: {
    textAlign: "left"
  },
  center: {
    textAlign: "center"
  }
};

const ItemForSaleFormModal = props => (
  <Modal show={props.isItemModalVisible}>
    <Modal.Header>
      <Modal.Title>
        {props.action === "Add" ? "Add" : "Update"} Item
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={styles.center}>
      {props.action === "Update" && (
        <Image
          src={`https://ipfs.io/ipfs/${props.newItem.imgHash}`}
          rounded
          responsive
        />
      )}
      <Form style={styles.form}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            value={props.newItem.name}
            placeholder="Enter name"
            onChange={props.handleAddItemInputChange("name")}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            value={props.newItem.description}
            placeholder="Enter description"
            onChange={props.handleAddItemInputChange("description")}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Price</ControlLabel>
          <FormControl
            value={props.newItem.price}
            placeholder="Enter price"
            onChange={props.handleAddItemInputChange("price")}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>
            {props.action === "Update" ? "New Image (Optional)" : "Image"}
          </ControlLabel>
          <FormControl type="file" onChange={props.handleAddItemImageChange} />
        </FormGroup>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      {props.action === "Add" && (
        <Button bsStyle="primary" onClick={props.handleAddItemModal}>
          Add
        </Button>
      )}
      {props.action === "Update" && (
        <Button bsStyle="primary" onClick={props.handleUpdateItemModal}>
          Update
        </Button>
      )}
      <Button bsStyle="danger" onClick={props.handleCancelModal}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ItemForSaleFormModal;
