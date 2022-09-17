import React from "react";
import Alert from "react-bootstrap/Alert";

function AlertDismissible({onHide, message }) {
  return (
    <Alert variant="danger" onClose={onHide} dismissible>
      {message}
    </Alert>
  );
}

export default AlertDismissible;
