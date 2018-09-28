import React from "react";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Col
} from "react-bootstrap";

const styles = {
  form: {
    textAlign: "left"
  }
};

const ProfileForm = props => (
  <Form horizontal>
    <FormGroup>
      <Col componentClass={ControlLabel} md={4} style={styles.form}>
        Balance
      </Col>
      <Col componentClass={ControlLabel} md={8}>
        {props.balance} ether
        {props.balance > 1 ? "s" : ""}
      </Col>
    </FormGroup>
    {sessionStorage.getItem("userRole") === "Owner" && (
      <FormGroup>
        <Col componentClass={ControlLabel} md={4} style={styles.form}>
          Commission
        </Col>
        <Col componentClass={ControlLabel} md={8}>
          {props.commission} ether
          {props.commission > 1 ? "s" : ""}
        </Col>
      </FormGroup>
    )}
    {sessionStorage.getItem("userRole") !== "Owner" && (
      <FormGroup>
        <Col componentClass={ControlLabel} md={4} style={styles.form}>
          Email
        </Col>
        <Col md={8}>
          <FormControl
            value={props.contact.email}
            placeholder="Enter email"
            onChange={props.handleContactInputChange("email")}
            disabled={!props.isUpdating}
          />
        </Col>
      </FormGroup>
    )}
    {sessionStorage.getItem("userRole") !== "Owner" && (
      <FormGroup>
        <Col componentClass={ControlLabel} md={4} style={styles.form}>
          Contact Number
        </Col>
        <Col md={8}>
          <FormControl
            value={props.contact.number}
            placeholder="Enter contact number"
            onChange={props.handleContactInputChange("number")}
            disabled={!props.isUpdating}
          />
        </Col>
      </FormGroup>
    )}

    {!props.isUpdating &&
      sessionStorage.getItem("userRole") !== "Owner" && (
        <Button onClick={props.handleUpdateProfile} bsStyle="primary" block>
          Update Profile
        </Button>
      )}
    {sessionStorage.getItem("userRole") === "Owner" && (
      <Button onClick={props.handleWithdrawCommission} bsStyle="primary" block>
        Withdraw Commission
      </Button>
    )}
    {props.isUpdating && (
      <FormGroup>
        <Col md={6}>
          <Button onClick={props.handleConfirm} bsStyle="primary" block>
            Confirm
          </Button>
        </Col>
        <Col md={6}>
          <Button onClick={props.handleCancel} bsStyle="danger" block>
            Cancel
          </Button>
        </Col>
      </FormGroup>
    )}
  </Form>
);

export default ProfileForm;
