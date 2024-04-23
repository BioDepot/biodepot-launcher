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
import { app, os } from "@neutralinojs/lib";

export default (props) => {
   const [show, setShow] = useState(!props.hasDocker);
   const [showBwb, setShowBwb] = useState(!show && props.hasDocker && !props.hasBwb);
   const [showUitls, setShowUtils] = useState(!show && props.hasDocker && props.hasBwb && !props.hasUtils);
   const [showBwbMessage, setBwbShowMessage] = useState(false);
   const [disableInstall, setDisableInstall] = useState(false);
   const [disableClose, setDisableClose] = useState(false);
   const [showBwbComplete, setBwbShowComplete] = useState(false);
   const [showUtilsMessage, setUtilsShowMessage] = useState(false);
   const [showUtilsComplete, setUtilsShowComplete] = useState(false);

   const handleBwbClose = () => {
      setShowBwb(false);
      
      if (!props.hasUtils && props.hasDocker) {
         setShowUtils(true);
      }
   };

   const handleUtilsClose = () => {
      setShowUtils(false);
   }

   const openDockerPage = async () => {
      await os.open(DOCKER_PAGE_URL);
   };

   const getBwb = async () => {
      setBwbShowMessage(true);
      setDisableInstall(true);
      setDisableClose(true);

      await os.execCommand(`docker pull biodepot/bwb:latest`).then(() => {
         setBwbShowMessage(false);
         setDisableClose(false);
         setBwbShowComplete(true);
         setDisableInstall(false);
         props.hasBwb = true;
      });
   };

   const getUtils = async () => {
      setUtilsShowMessage(true);
      setDisableInstall(true);
      setDisableClose(true);

      await os.execCommand(`docker pull biodepot/launcher-utils:1.0`).then(() =>{
         setUtilsShowMessage(false);
         setDisableClose(false);
         setUtilsShowComplete(true);
         setDisableInstall(false);
         props.hasUtils = true;
      });
   }

   const closeApp = async () => {
      await app.exit();
   }

   return (
      <div data-backdrop="static">
         <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Missing Dependencies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>
                  Docker was not detected on your system.  Please install Docker.  If you have already installed Docker Desktop, please 
                  open Docker Desktop and relaunch this application.
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={closeApp}>
                  Exit
               </Button>
               <Button variant="primary" onClick={openDockerPage}>
                  Get Docker
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showBwb} onHide={handleBwbClose} backdrop="static" keyboard={false}>
            {disableClose ? 
            <Modal.Header>
               <Modal.Title>Bwb Install/Update</Modal.Title>
            </Modal.Header>
            :
            <Modal.Header closeButton>
               <Modal.Title>Bwb Install/Update</Modal.Title>
            </Modal.Header>}
            <Modal.Body>
               <div>We are detecting that the latest version of Bwb is not on your system.  Verify that you aren't currently running Bwb 
                  and please update or install Bwb.</div>
                  {showBwbMessage && <div><hr></hr>Installation will take several minutes... please stay on this pop-up while Bwb installs.</div>}
                  {showBwbComplete && <div><hr></hr>Installation complete!</div>}
            </Modal.Body>
            {props.hasBwb ? 
            <Modal.Footer>
               <Button disabled={disableClose} variant="secondary" onClick={handleBwbClose}>
                  Close
               </Button> 
            </Modal.Footer>
            :
            <Modal.Footer>
               <Button disabled={disableClose} variant="secondary" onClick={closeApp}>
                  Exit
               </Button>
               <Button disabled={disableInstall} variant="primary" onClick={getBwb}>
                  Get Bwb
               </Button>
            </Modal.Footer>}
         </Modal>
         <Modal show={showUitls} onHide={handleUtilsClose} backdrop="static" keyboard={false}>
            {disableClose ? 
            <Modal.Header>
               <Modal.Title>Launcher Utils Install</Modal.Title>
            </Modal.Header>
            :
            <Modal.Header closeButton>
               <Modal.Title>Launcher Utils Install</Modal.Title>
            </Modal.Header>}
            <Modal.Body>
               <div>
                  The necessary Launcher utilities image is not present on your system.  It is necessary for the Launcher.  Please download now.
               </div>
                  {showUtilsMessage && <div><hr></hr>Installation will take only a moment...</div>}
                  {showUtilsComplete && <div><hr></hr>Installation complete!</div>}
            </Modal.Body>
            {props.hasUtils ? 
            <Modal.Footer>
               <Button disabled={disableClose} variant="secondary" onClick={handleUtilsClose}>
                  Close
               </Button>
            </Modal.Footer>
            :
            <Modal.Footer>
               <Button disabled={disableClose} variant="secondary" onClick={closeApp}>
                  Exit
               </Button>
               <Button disabled={disableInstall} variant="primary" onClick={getUtils}>
                  Get Utils
               </Button>
            </Modal.Footer>}
         </Modal>
      </div>
  );
};