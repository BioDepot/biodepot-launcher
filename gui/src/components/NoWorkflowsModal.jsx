/**
 * Renders the modal to be shown inside of the workflows category if the user doesn't have any installed workflows
 * @prop {boolean} show - whether to show the alert or not
 */

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

const NoWorkflowsModal = (props) => {
   const [show, setShow] = useState(props.show);
   const handleClose = () => setShow(false);

   return (
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
         <Modal.Header closeButton>
            <Modal.Title>No Workflows</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            You currently do not have any workflows installed under this category. 
            Install them through the Workflow Marketplace and they will be displayed here.
         </Modal.Body>
         <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
               Close
            </Button>
         </Modal.Footer>
      </Modal>
  );
};

export default NoWorkflowsModal;