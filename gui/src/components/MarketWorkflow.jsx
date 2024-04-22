 /**
 * Renders a given workflow under a workflow category inside the workflow marketplace page
 * Has functionality for the user to download thw ows file for a workflow and save it under its own directory
 * Will also download the README file for the workflow if it exists
 * @prop {boolean} installed - Whether this workflow has already been installed
 * @prop {string} name - The name of the workflow
 * @prop {string} category - The category the workflow belongs to
 * @prop {FUNCTION} update - Updates the list of currently installed workflows when called
 */

import { useState, useEffect } from 'react';
import { BsCircleFill} from 'react-icons/bs';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { filesystem, os } from "@neutralinojs/lib";

function Workflow(props) {
   const [isLoading, setIsLoading] = useState(false);
   const [hash, setHash] = useState('');

   /**
    * Renders the tooltip to display for worklows that havent installed prompting the user to click on it to install it
   */
   
   const renderTooltip = () => {
      return (
         <Tooltip>
            Click Me to Install Workflow
         </Tooltip>
      );
   };  

   // Downloads and installs a workflow
   const downloadWorkflow = async () => {
      const workflowType = props.category;
      const workflow = props.name;

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

         setHashState();
         
         props.update();
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
         setHash((await os.execCommand(`docker run -v ${pwd}:/workspace/mnt biodepot/launcher-utils:1.0 "hash" /workspace/mnt/${props.category}/${props.name}`)).stdOut);
      } else {
         setHash((await os.execCommand(`docker run -v ".":"/workspace/mnt" biodepot/launcher-utils:1.0 "hash" /workspace/mnt/${props.category}/${props.name}`)).stdOut);
      }
   };

   const createHashFile = async () => {
      if (window.NL_OS === "Windows") {
         let pwd = (await os.execCommand('echo %cd%')).stdOut;
         pwd = pwd.replace(/\\/g, '\/');
         alert(hash);
         await os.execCommand(`echo|set /p="${hash}" > ${pwd}/.storage/${props.category}-${props.name}`);
      } else {
         await os.execCommand(`echo -n "${hash}" > .storage/${props.category}-${props.name}`);
      }
   };

   useEffect(() => {
      if (hash !== '') {
         createHashFile();
      }
   }, [hash]);

   /**
    * Renders the install button for the workflow
    * If the workflow has already been installed, 
    *    will render as a green, non-clickable button saying its already been installed
    * If the workflow hasn't already been installed,
    *    will render as a yellow, clickable button which upon the user hovering over it
    *    will render a tooltip telling the user to click on it to download the workflow
   */
   const renderInstallButton = () => {
      if (props.installed) {
         return (
            <td className="align-middle">
               <div className="align-middle border rounded-pill p-2 bg-muted">
                  <BsCircleFill className="me-2 text-success" />
                  Installed
               </div>
            </td>
         );
      } else if (isLoading) {
         return (
            <td className="align-middle">
               <div className="align-middle border rounded-pill p-2 bg-muted workflow-update-btn">
                  <Spinner animation="border" size="sm" className="me-2 anim-spinner" />
                  Installing
               </div>
            </td>
         );
      } else {
         return (
            <td className="align-middle">
               <OverlayTrigger placement="top" overlay={renderTooltip()}>
                  <div 
                     className="align-middle border rounded-pill p-2 bg-muted workflow-update-btn"
                     onClick={downloadWorkflow}
                  >
                     <BsCircleFill className="me-2 text-warning" />
                     Install Now
                  </div>
               </OverlayTrigger>
            </td>
         );
      }
   };

   return (
      <tr className="align-middle">
         <td>{props.name}</td>
         { renderInstallButton() }
      </tr>
   );
};

export default Workflow;