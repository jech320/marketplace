import React, { Component } from "react";
import ReactLoading from "react-loading";
import { Modal } from "react-bootstrap";
import { ropstenProvider } from "./../utils/main";

const styles = {
  loading: {
    fill: "black",
    height: "20%",
    width: "20%",
    margin: "0 auto"
  },
  text: {
    textAlign: "center"
  }
};

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const txHash = sessionStorage.getItem("pendingTxHash");

    if (txHash) {
      await ropstenProvider.waitForTransaction(txHash);
      sessionStorage.removeItem("pendingTxHash");
    }
  }

  render() {
    return (
      <Modal show={true}>
        <Modal.Body>
          <div>
            <ReactLoading type={"bubbles"} style={styles.loading} />
          </div>
          <h2 style={styles.text}>Processing</h2>
        </Modal.Body>
      </Modal>
    );
  }
}

export default Loading;
