/**
 * Creates the alert to the user telling them they do not have a dependency installed and directing them to the installation page
 * Only shows the alert once if and only if we cannot run a dependency command
 * Alert will be shown again upon re-opening App
 * @prop {boolean} show - whether to show the alert or not
 */

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { os } from "@neutralinojs/lib";

export default (props) => {
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
    }

    const getBwb = async () => {
        await os.execCommand(`docker pull biodepot/bwb:latest`)
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Missing Dependencies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>We are detecting that the latest version of Bwb is not on your system.  Verify that you aren't currently running Bwb 
                    and please update or install Bwb.</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="primary" onClick={() => {getBwb(); handleClose();} }>
                    Get Bwb
                </Button>
            </Modal.Footer>
        </Modal>
    );
};