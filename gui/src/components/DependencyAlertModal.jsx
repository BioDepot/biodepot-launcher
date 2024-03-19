/**
 * Creates the alert to the user telling them they do not have a dependency installed and directing them to the installation page
 * Only shows the alert once if and only if we cannot run a dependency command
 * Alert will be shown again upon re-opening App
 * @prop {boolean} show - whether to show the alert or not
 */

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { DOCKER_PAGE_URL } from '../constants';
import { os } from "@neutralinojs/lib";

export default (props) => {
   const [show, setShow] = useState(!props.hasDocker || !props.hasAWS || !props.hasDM);
   const [showBwb, setShowBwb] = useState(!show && props.hasDocker);

   const handleClose = () => {
      setShow(false);
      
      if (!props.hasBwb && props.hasDocker) {
         setShowBwb(true);
      }
   }

   const handleBwbClose = () => {
      setShowBwb(false);
   }

   const openDockerPage = async () => {
      await os.open(DOCKER_PAGE_URL);
   };

   const openAWSPage = async () => {
      await os.open('https://aws.amazon.com/cli/');
   }

   const openDMPage = async () => {
      await os.open('https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/index.html');
   }

   const getBwb = async () => {
      await os.execCommand(`docker pull biodepot/bwb:latest`)
  }

   return (
      <div>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Missing Dependencies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>We are detecting that the following dependencies are not present on your system.  You can still use the launcher to download workflows
               but your ability to launch workflows will be limited.</div>
               {!props.hasDocker || !props.hasAWS || !props.hasDM ? <hr></hr> : null}
               {!props.hasDocker ? <div>Docker: Missing</div> : null}
               {!props.hasAWS ? <div>AWS CLI: Missing</div> : null}
               {!props.hasDM ? <div>Docker Machine: Missing</div> : null}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
               {!props.hasDocker ? 
                  <Button variant="primary" onClick={openDockerPage}>
                     Get Docker
                  </Button> : null}
               {!props.hasAWS ? 
                  <Button variant="primary" onClick={openAWSPage}>
                     Get AWS CLI
                  </Button> : null}
               {!props.hasDM ? 
                  <Button variant="primary" onClick={openDMPage}>
                     Get Docker Machine
                  </Button> : null}
            </Modal.Footer>
         </Modal>
         <Modal show={showBwb} onHide={handleBwbClose}>
            <Modal.Header closeButton>
               <Modal.Title>Bwb Install/Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                  <div>We are detecting that the latest version of Bwb is not on your system.  Verify that you aren't currently running Bwb 
                    and please update or install Bwb.</div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleBwbClose}>
                  Close
               </Button>
               {!props.hasBwb ? 
                  <Button variant="primary" onClick={() => {getBwb(); handleClose();}}>
                     Get Bwb
                  </Button> : null}
            </Modal.Footer>
         </Modal>
      </div>
  );
};