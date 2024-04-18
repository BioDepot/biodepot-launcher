/**
 * Renders the individual workflow that has been installed
 * @prop {string} category - The category that the workflow belongs to
 * @prop {string} name - The name of the workflow
 */

// FOR WORKFLOWS, MAKE A FOLDER FOR EACH WORKFLOW CATEGORY THEN INSTALL FOLDER FOR WORKFLOW UNDER ITS CATEGORY
// THAT WAY WE KNOW WHICH CATEGORY IT BELONGS TO WITHOUT HAVING TO TRACK IT A DIFFERENT WAY OR BY USING STORAGE API
import { useState, useEffect } from 'react';
import { BsCircleFill} from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaBook, FaLaptopCode } from "react-icons/fa";
import useHasDocu from '../hooks/useHasDocu';
import { LAUNCH_COMMAND, DOCKER_PAGE_URL } from '../constants';
import LaunchModal from './LaunchModal';
import { os, filesystem, window } from "@neutralinojs/lib";


function Workflow(props) {
   const [showLaunchModal, setShowLaunchModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const closeLaunchModal = () => setShowLaunchModal(false);
   const openLaunchModal = () => setShowLaunchModal(true);
   // checks to see if documentation is available for the workflow
   const [show, setShow] = useState(false);
   const [showResult, setShowResult] = useState(false);
   const [updated, setUpdated] = useState(props.updated ? true : false);
   const [reverted, setReverted] = useState(props.revert ? true : false);
   const hasDocu = useHasDocu(props.name, props.category);

   const [showUpdate, setShowUpdate] = useState(false);
   const openUpdateModal = () => setShowUpdate(true);
   const closeUpdateModal = () => setShowUpdate(false);
   const [showRevert, setShowRevert] = useState(false);
   const openRevertModal = () => setShowRevert(true);
   const closeRevertModal = () => setShowRevert(false);

   const [showDockerModal, setShowDockerModal] = useState(false);
   const openDockerModal = () => setShowDockerModal(true);
   const closeDockerModal = () => setShowDockerModal(false);

   const [showBwbModal, setShowBwbModal] = useState(false);
   const openBwbModal = () => setShowBwbModal(true);
   const closeBwbModal = () => setShowBwbModal(false);

   const [disableInstall, setDisableInstall] = useState(false);
   const [disableClose, setDisableClose] = useState(false);
   const [showInstallationMessage, setShowInstallationMessage] = useState(false);
   const [showComplete, setShowComplete] = useState(false);

   let initRegion = "";
   let initInstance = "";

   const [region, setRegion] = useState(initRegion);
   const [instance, setInstance] = useState(initInstance);

   const [hash, setHash] = useState('');

   const changeRegion = (e) => {
      setRegion(e.target.value)
   }

   const changeInstance = (e) => {
      setInstance(e.target.value)
   }

   const [disableLaunch, setDisableLaunch] = useState(false);
   const [showMessage, setShowMessage] = useState(false);

   const handleClose = () => setShow(false);
   
   const openInBrowser = async () => {
      const openBWB = async () => {
         await os.open("http://localhost:6080");
         closeLaunchModal();
      };

      setTimeout(() => {
         openBWB();
      }, 10000);
   };

   const runOpenCommand = async () => {
      try {
         const command = `${LAUNCH_COMMAND} -e STARTING_WORKFLOW=/data/${props.category}/${props.name}/${props.name}.ows biodepot/bwb`;
         console.log(command);
         await os.execCommand(command, { background: true });
      } catch (e) {
         console.log(e);
      }
   };

   const openGitPod = async () => {
      const alteredWorkflowName = `${props.name}`.replace('_', '-');
      await os.open("https://gitpod.io/#https://github.com/Biodepot-workflows/" + alteredWorkflowName);

      closeLaunchModal();
   }

   const openOnAWS = async () => {
      setDisableLaunch(true);
      setShowMessage(true);
      
      const output = (await os.execCommand(`docker run -v ".":"/workspace/mnt" -v "$HOME/.aws":"/workspace/aws" launcher-utils:1.0 launch ${region} ${instance} ${props.name} ${props.category}/${props.name}`));
      await os.open("http://" + output.stdOut); 
      
      setShow(false);
   };
   
   const renderTooltip = (message) => {
      return (
         <Tooltip>
            { message }
         </Tooltip>
      );
   };

   const renderUpdateButton = () => {
      if (updated && reverted) {
         return (
            <div className="align-middle border rounded-pill p-2 bg-muted">
               <span>Updated</span>
            </div>
         );
      } else if (updated && !reverted) { 
         return (
            <OverlayTrigger placement="top" overlay={renderTooltip("Click to Rebase Workflow")}>
               <div 
                  className="border rounded-pill p-2 bg-muted workflow-update-btn d-flex align-items-center justify-content-between"
                  onClick={openRevertModal}
               >
                  <span>Rebase</span>
               </div>
            </OverlayTrigger>
         );
      } else if (isLoading) {
         return (
            <div className="align-middle border rounded-pill p-2 bg-muted workflow-update-btn d-flex align-items-center justify-content-between">
               <span>Installing</span>
            </div>
         )
      } else {
         return (
            <OverlayTrigger placement="top" overlay={renderTooltip("Click to Update Workflow")}>
               <div 
                  className="border rounded-pill p-2 bg-muted workflow-update-btn d-flex align-items-center justify-content-between"
                  onClick={openUpdateModal}
               >
                  <span>Update Available</span>
               </div>
            </OverlayTrigger>
         );
      }
   };

   const renderCircleFill = () => {
      if (updated && !isLoading) {
         return (
            <OverlayTrigger placement="top" overlay={renderTooltip("Workflow is Current")}>
               <div className="align-middle p-2 bg-muted">
                  <BsCircleFill size={28} className="text-success" />
               </div>
            </OverlayTrigger>
         );
      }  else if (isLoading) {
         return (
            <div className="align-middle p-2 bg-muted d-flex align-items-center justify-content-between">
               <Spinner size={28} animation="border" className="anim-spinner" />
            </div>
         );
      } else {
         return (
            <OverlayTrigger placement="top" overlay={renderTooltip("Workflow is Out of Date")}>
               <div className="align-middle p-2 bg-muted d-flex align-items-center justify-content-between">
                  <BsCircleFill size={28} className="text-warning" />
               </div>
            </OverlayTrigger>
         );
      }
   };

   const updateWorkflow = async () => {
      const workflowType = props.category;
      const workflow = props.name;
 
      await os.execCommand(`rm -rf ./${workflowType}/${workflow}`);
      await os.execCommand(`rm ./.storage/${workflowType}-${workflow}`);

      try {
         setIsLoading(true);
         let folders = [];
         let files = [];

         for (let i = 0; i < props.fileDetails.length; i++) {
            const fileName = props.fileDetails[i][1];
            
            if (fileName !== undefined) {
                  if (fileName.startsWith(workflowType + '/' + workflow)) {
                     const fileType = props.fileDetails[i][0];

                     if (fileType === 'tree') {
                        const splitFolders = fileName.split('/');
                        if (splitFolders[0] === workflowType && splitFolders[1] === workflow) {
                              folders.push(fileName);
                        }
                     } else if (fileType === 'blob' && fileName.startsWith(workflowType + '/' + workflow + '/')) {
                        files.push(fileName);
                     }
                  }
            }
         }

         for (let folder of folders) {
            await filesystem.createDirectory(folder);
         }

         for (let file of files) {
            await os.execCommand(`curl -o ./${file} https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/${file}`);
         }
         
         for (let i = 0; i < props.needsUpdates.length; i++) {
            if (workflowType === props.needsUpdates[i][0] && workflow === props.needsUpdates[i][1]) {
               let array = props.needsUpdates;
               array.splice(i, 1);
               break;
            }
         }

         setHashState();

         if (!reverted) {
            clearRevert(workflowType, workflow);
            setReverted(true);
         }

         setUpdated(true);

      } catch (e) {
         console.log(e);
      } finally {
         setIsLoading(false);
         setHash('');
      }
   };

   const setHashState = async () => {
      if (window.NL_OS === "Windows") {
         let pwd = (await os.execCommand('echo %cd%')).stdOut;
         pwd = pwd.replace(/\\/g, '\/');
         setHash((await os.execCommand('docker run -v ' + pwd + ':/workspace/mnt biodepot/launcher-utils:1.0 "hash" /workspace/mnt/' + props.category + '/' + props.name)).stdOut);
         alert(hash);
      } else {
         setHash((await os.execCommand(`docker run -v ".":"/workspace/mnt" biodepot/launcher-utils:1.0 "hash" /workspace/mnt/${props.category}/${props.name}`)).stdOut);
      }
   };

   const createHashFile = async () => {
      if (window.NL_OS === "Windows") {
         alert(hash);
         await os.execCommand('echo -n "' + hash + '" > .storage/' + props.category + '-' + props.name);
      } else {
         await os.execCommand(`echo -n "${hash}" > .storage/${props.category}-${props.name}`);
      }
   };

   useEffect(() => {
      if (hash !== '') {
         createHashFile();
      }
   }, [hash]);

   const revertWorkflow = async () => {
      const workflowType = props.category;
      const workflow = props.name;
 
      await os.execCommand(`rm -rf ./${workflowType}/${workflow}`);

      try {
         setIsLoading(true);
         let folders = [];
         let files = [];

         for (let i = 0; i < props.fileDetails.length; i++) {
            const fileName = props.fileDetails[i][1];
            
            if (fileName !== undefined) {
                  if (fileName.startsWith(workflowType + '/' + workflow)) {
                     const fileType = props.fileDetails[i][0];

                     if (fileType === 'tree') {
                        const splitFolders = fileName.split('/');
                        if (splitFolders[0] === workflowType && splitFolders[1] === workflow) {
                              folders.push(fileName);
                        }
                     } else if (fileType === 'blob' && fileName.startsWith(workflowType + '/' + workflow + '/')) {
                        files.push(fileName);
                     }
                  }
            }
         }

         for (let folder of folders) {
            await filesystem.createDirectory(folder);
         }

         for (let file of files) {
            await os.execCommand(`curl -o ./${file} https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/${file}`);
         }

         clearRevert(workflowType, workflow);
         setReverted(true);
      } catch (e) {
         console.log(e);
      } finally {
         setIsLoading(false);
      }
   };

   const clearRevert = (workflowType, workflow) => {
      for (let i = 0; i < props.canRevert.length; i++) {
         if (workflowType === props.canRevert[i][0] && workflow === props.canRevert[i][1]) {
            let array = props.canRevert;
            array.splice(i, 1);
            break;
         }
      }
   }

   const openDoc = async () => {
      for (let i = 0; i < props.fileDetails.length; i++) {
         const fileName = props.fileDetails[i][1];
         
         if (fileName !== undefined) {
            if (fileName.endsWith(props.name + '/README.md')) {
               await os.open(`https://github.com/Biodepot-workflows/launcher-selection/blob/main/${fileName}`);
               break;
            }
         }
      } 
   };

   // Renders the `Open-Documentation` button for a workflow
   // Button will be disabled if workflow doesn't have a README file associated
   const renderDocButton = () => {
      if (hasDocu !== null) {
         if (hasDocu) {
            return (
               <OverlayTrigger placement="top" overlay={renderTooltip("Open Documentation")}>
                  <div className="center" id={props.name + "-docs"} onMouseEnter={() => onHoverDocs()} onMouseLeave={() => offHoverDocs()} onClick={() => openDoc()}>
                     <FaBook size={28} />
                  </div>
               </OverlayTrigger>
            );
         } else {
            return (
               <OverlayTrigger placement="top" overlay={renderTooltip("Documentation is Not Available for this Workflow")}>
                  <div className="center">
                     <FaBook size={28} className="grey"/>
                  </div>
               </OverlayTrigger>
            );
         }
      }
   };

   const onHoverDocs = () => {
      document.getElementById(props.name + "-docs").className = "hover-on";
   }

   const offHoverDocs = () => {
      document.getElementById(props.name + "-docs").classList.remove("hover-on");
      document.getElementById(props.name + "-docs").className = "hover-off";
   }

   const onHoverLaunch = () => {
      document.getElementById(props.name + "-launch").className = "hover-on";
   }

   const offHoverLaunch = () => {
      document.getElementById(props.name + "-launch").classList.remove("hover-on");
      document.getElementById(props.name + "-launch").className = "hover-off";
   }

   const openDockerPage = async () => {
      await os.open(DOCKER_PAGE_URL);
   };

   const checkBwbDependencies = () => {
      if (props.hasDocker === false) {
         closeLaunchModal();
         openDockerModal();
      } else if (props.hasBwb === false) {
         closeLaunchModal();
         openBwbModal();
      } else {
         runOpenCommand();
         openInBrowser(); 
      }
   }

   const installBwb = async () => {
      setShowInstallationMessage(true);
      setDisableInstall(true);
      setDisableClose(true);

      await os.execCommand(`docker pull biodepot/bwb:latest`).then(() => {
         setShowInstallationMessage(false);
         setDisableClose(false);
         setShowComplete(true);
         props.hasBwb = true;
      });
   }

   return (
      <tr className="align-middle">
         <LaunchModal 
            show={showLaunchModal} 
            handleClose={closeLaunchModal} 
            inBrowser={() => { checkBwbDependencies(); }} 
            onGitPod={() => { openGitPod(); }}
            onAWS={() => { setShowLaunchModal(false); setShowMessage(false); setDisableLaunch(false); setRegion(""); setInstance(""); setShow(true); }}
         />

         <td>{props.name}</td>
         <td>{renderCircleFill()}</td>
         <td>{renderUpdateButton()}</td>
         <td>{renderDocButton()}</td>
         <td>
            <OverlayTrigger placement="top" overlay={renderTooltip("Launch Workflow")}>
               <div className="center" id={props.name + "-launch"} onMouseEnter={() => onHoverLaunch()} onMouseLeave={() => offHoverLaunch()} onClick={openLaunchModal}>
                  <FaLaptopCode size={28} />
               </div>
            </OverlayTrigger>
            
         </td>
         <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Choose Parameters for AWS Instance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <label>Region:&nbsp;</label>
               <input type="text" list= "region" value={region} onChange={changeRegion}/>
               <datalist id="region" value={region} onChange={changeRegion}>
                  <option value="us-east-2">us-east-2</option>
                  <option value="us-east-1">us-east-1</option>
                  <option value="us-west-1">us-west-1</option>
                  <option value="us-west-2">us-west-2</option>
               </datalist>
               <br />
               <br />
               <label>Instance Type:&nbsp;</label>
               <input id="instanceText" type="text" list= "instance" value={instance} onChange={changeInstance}/>
               <datalist id="instance" value={instance} onChange={changeInstance}>
                  <option value="m5d.4xlarge" selected>m5d.4xlarge</option>
               </datalist>
            </Modal.Body>
            <Modal.Footer>
               {showMessage && <text>Launching will take several minutes...</text>}
               <Button disabled={disableLaunch} variant="primary" onClick={() => openOnAWS()}>
                  Launch
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showUpdate} onHide={closeUpdateModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <span>Selecting "Update" will update the workflow and overwrite any changes that were made locally.  Do you still want to update?</span>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={() => { updateWorkflow(); closeUpdateModal(); } }>
                  Update
               </Button>
               <Button variant="primary" onClick={() => closeUpdateModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showRevert} onHide={closeRevertModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <span>Selecting "Rebase" will rebase the workflow and overwrite any changes that were made locally.  Do you still want to rebase?</span>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={() => { revertWorkflow(); closeRevertModal(); } }>
                  Rebase
               </Button>
               <Button variant="primary" onClick={() => closeRevertModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showDockerModal} onHide={closeDockerModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <span>The workflow cannot be launched in a browser without Docker.  Please close the Launcher and install Docker.</span>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={openDockerPage}>
                  Get Docker
               </Button>
               <Button variant="primary" onClick={() => closeDockerModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showBwbModal} onHide={closeBwbModal} backdrop="static" keyboard={false}>
            {disableClose ? 
            <Modal.Header>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header> : 
            <Modal.Header closeButton>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>}
            <Modal.Body>
               <span>The workflow cannot be launched in a browser without Bwb.  Please install Bwb.</span>
               {showInstallationMessage && <div><hr></hr>Installation will take several minutes... please stay on this pop-up while Bwb installs.</div>}
               {showComplete && <div><hr></hr>Installation complete!  Please relaunch the workflow.</div>}
            </Modal.Body>
            <Modal.Footer>
               <Button disabled={disableInstall} variant="primary" onClick={installBwb}>
                  Get Bwb
               </Button>
               <Button disabled={disableClose} variant="primary" onClick={() => closeBwbModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
      </tr>
   );
};

export default Workflow;