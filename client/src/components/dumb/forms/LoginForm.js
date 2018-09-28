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

const LoginForm = (props) => (
  <Form style={styles.form}>
    <FormGroup>
      <ControlLabel>Private Key</ControlLabel>
      <FormControl
        placeholder="Enter private key"
        onChange={props.handleInputChange('privateKey')}
      />
    </FormGroup>
    <Button
      onClick={props.handleLogin}
      bsStyle="primary"
      block
    >
      Login
    </Button>
  </Form>
);

export default LoginForm