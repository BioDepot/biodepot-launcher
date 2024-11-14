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
import { LAUNCH_COMMAND } from '../constants';
import LaunchModal from './LaunchModal';
import { os, filesystem } from "@neutralinojs/lib";


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

   const [showAWSModal, setShowAWSModal] = useState(false);
   const openAWSModal = () => setShowAWSModal(true);
   const closeAWSModal = () => setShowAWSModal(false);

   let initRegion = "";
   let initInstance = "";

   const [region, setRegion] = useState(initRegion);
   const [instance, setInstance] = useState(initInstance);

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
         const command = `${LAUNCH_COMMAND} -e STARTING_WORKFLOW=/data/workflows/${props.category}/${props.name}/${props.name}.ows biodepot/bwb`;
         console.log(command);
         await os.execCommand(command, { background: true });
      } catch (e) {
         console.log(e);
      }
   };

   const openGitPod = async () => {
      const alteredWorkflowName = `${props.name}`.replaceAll('_', '-');
      await os.open("https://gitpod.io/#https://github.com/Biodepot-workflows/" + alteredWorkflowName);

      closeLaunchModal();
   }

   const openOnAWS = async () => {
      setDisableLaunch(true);
      setShowMessage(true);
      
      let output = "";

      const osType = window.NL_OS;


      if (osType === "Windows") {
         let home = (await os.execCommand('echo %userprofile%')).stdOut.trim();
         let homeAltered = home.replace(/\\/g, '\/');
         output = await os.execCommand(`docker run --rm -v .:/workspace/mnt -v ${homeAltered}/.aws:/root/.aws -v ${homeAltered}/.docker/machine:/root/.docker/machine biodepot/launcher-utils:latest "launch" "${region}" "${instance}" "${props.name}" "./workflows/${props.category}/${props.name}" "${osType}" "${home}"`);
      } else {
         let home = (await os.execCommand(`echo $HOME`)).stdOut.trim();
         output = await os.execCommand(`docker run --rm -v ".":"/workspace/mnt" -v "${home}/.aws":"/root/.aws" -v "${home}/.docker/machine":"/root/.docker/machine" biodepot/launcher-utils:latest "launch" "${region}" "${instance}" "${props.name}" "./workflows/${props.category}/${props.name}" "${osType}" "${home}"`);
      }

      if (osType === "Linux" || osType === "Windows") {
         if (output.stdOut !== "") {
            await os.open("http://" + output.stdOut);
         }
      } else {
         if (output.stdOut !== "") {
            await os.open("http://" + output.stdOut.split('\n')[0]);
         }
      }
      
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
                  <span>Update</span>
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
 
      await os.execCommand(`rm -rf ./workflows/${workflowType}/${workflow}`);
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
            await filesystem.createDirectory(`./workflows/${folder}`);
         }

         for (let file of files) {
            await os.execCommand(`curl -o ./workflows/${file} https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/${file}`);
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
      }
   };

   const setHashState = async () => {
      if (window.NL_OS === "Windows") {
         await os.execCommand(`docker run --rm -v .:/workspace/mnt biodepot/launcher-utils:latest "hash" /workspace/mnt/workflows/${props.category}/${props.name} > ./.storage/${props.category}-${props.name}`);
      } else {
         await os.execCommand(`docker run --rm -v ".":"/workspace/mnt" biodepot/launcher-utils:latest "hash" /workspace/mnt/workflows/${props.category}/${props.name} > ./.storage/${props.category}-${props.name}`);
      }
   };

   const revertWorkflow = async () => {
      const workflowType = props.category;
      const workflow = props.name;
 
      await os.execCommand(`rm -rf ./workflows/${workflowType}/${workflow}`);

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
            await filesystem.createDirectory(`./workflows/${folder}`);
         }

         for (let file of files) {
            await os.execCommand(`curl -o ./workflows/${file} https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/${file}`);
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

   const openAWSPage = async () => {
      await os.open("https://aws.amazon.com/cli/");
   }

   const checkForAWS = () => {
      if (props.hasAWS === false) {
         closeLaunchModal();
         openAWSModal();
      } else {
         setShowLaunchModal(false);
         setShowMessage(false);
         setDisableLaunch(false);
         setRegion("");
         setInstance("");
         setShow(true);
      }
   }

   const updateFunctions = () => {
      updateWorkflow();
      closeUpdateModal();
   }

   const rebaseFunctions = () => {
      revertWorkflow();
      closeRevertModal();
   }

   return (
      <tr className="align-middle">
         <LaunchModal 
            show={showLaunchModal} 
            handleClose={closeLaunchModal} 
            inBrowser={() => { runOpenCommand(); openInBrowser(); }} 
            onGitPod={() => { openGitPod(); }}
            onAWS={() => { checkForAWS(); }}
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
               <Button variant="primary" onClick={() => updateFunctions()}>
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
               <Button variant="primary" onClick={() => rebaseFunctions()}>
                  Rebase
               </Button>
               <Button variant="primary" onClick={() => closeRevertModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showAWSModal} onHide={closeAWSModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
               <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <span>The workflow cannot be launched without AWS CLI.  Please close the Launcher and install AWS CLI.</span>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={openAWSPage}>
                  Get AWS CLI
               </Button>
               <Button variant="primary" onClick={() => closeAWSModal()}>
                  Cancel
               </Button>
            </Modal.Footer>
         </Modal>
      </tr>
   );
};

export default Workflow;