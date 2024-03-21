/**
 * Renders the modal asking the user if they want to launch BWB inside launcher or in browser
 * @prop {FUNCTION} inWindow - The function to call if the user wants to launch BWB inside launcher
 * @prop {FUNCTION} inBrowser - The function to call if the user wants to launch BWB inside browser
 * @return {JSX} - the modal asking the user
 */
import { useState } from 'react';
import { LAUNCH_BROSWER, LAUNCH_GITPOD, LAUNCH_AWS } from '../constants';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const LaunchModal = (props) => {
   const launchText = "How would you like to launch Bwb?";
   const duringText = "Launching BWB...";
   const [text, setText] = useState(launchText);
   const [spin, setSpin] = useState(false);

   const handleOption = (option) => {
      setText(duringText);
      setSpin(true);

      if (option === LAUNCH_BROSWER) {
         props.inBrowser();
      } else if (option === LAUNCH_AWS) {
         props.onAWS();
      } else if (option === LAUNCH_GITPOD) {
         props.onGitPod();
      }

      setTimeout(() => {
         setSpin(false);
         setText(launchText);
         props.handleClose();
      }, 10000);
   }

   const renderSpinner = () => {
      if (spin) {
         return (
            <Spinner animation="border" role="status" className="me-2 anim-spinner">
               <span className="visually-hidden">Loading...</span>
            </Spinner>
         );
      }
   };

   return (
      <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Launch Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         { renderSpinner() }
         <span>{ text }</span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleOption(LAUNCH_BROSWER)}>
          Browser
        </Button>
        <Button variant="secondary" onClick={() => handleOption(LAUNCH_GITPOD)}>
          GitPod
        </Button>
        <Button variant="secondary" onClick={() => handleOption(LAUNCH_AWS)}>
          AWS
        </Button>
      </Modal.Footer>
      </Modal>
   );
};

export default LaunchModal;