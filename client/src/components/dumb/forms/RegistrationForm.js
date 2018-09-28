import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';

const styles = {
  form: {
    textAlign: 'left'
  }
}

const RegistrationForm = (props) => (
  <Form style={styles.form}>
    <FormGroup>
      <ControlLabel>Private Key</ControlLabel>
      <FormControl
        placeholder="Enter private key"
        onChange={props.handleInputChange('privateKey')}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Email</ControlLabel>
      <FormControl
        placeholder="Enter email"
        onChange={props.handleInputChange('email')}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Contact Number</ControlLabel>
      <FormControl
        placeholder="Enter contact number"
        onChange={props.handleInputChange('contactNumber')}
        />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Role</ControlLabel>
      <FormControl
        componentClass="select"
        placeholder="Select role"
        onChange={props.handleSelectChange}
      >
        <option value="0">Select role</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </FormControl>
    </FormGroup>
    <Button
      onClick={props.handleRegister}
      bsStyle="primary"
      block
    >
      Register
    </Button>
  </Form>
);

export default RegistrationForm