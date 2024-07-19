import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const RebaseModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <span>Selecting "Rebase" will rebase the workflow and overwrite any changes that were made locally.  Do you still want to rebase?</span>
            </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={props.rebase}>
                Rebase
            </Button>
            <Button variant="primary" onClick={props.handleClose}>
                Cancel
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default RebaseModal;