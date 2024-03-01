/**
 * Creates the sidebar navigation
 */

import pic from '../BioDepot.png';
import SidebarItem from './SidebarItem';
import { FaGlobeAmericas } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { os } from "@neutralinojs/lib";

function Sidebar(props) {
   // Renders the list of workflow categories onto the sidebar
   // Each category can be clicked which will change its color to mark it as selected
   const renderCategories = () => {
      return CATEGORIES.map(category => 
         <li key={category}>
            <Link 
               to="/workflow-category" 
               className="nav-link text-white border mb-3 sidebar-nav-item sidebar-link"
               onClick={() => props.setSelectedPage(category)} 
               id={props.selectedPage === category ? "selected" : ''}
            >
               { category }
            </Link>
         </li>
      );
   };

   const openBwbDocs = async () => {
      await os.open('https://github.com/BioDepot/BioDepot-workflow-builder/blob/master/README.md');
   }

   const openGitPodDocs = async () => {
      await os.open('https://github.com/Biodepot-workflows/gitpod-docs/blob/main/GITPOD.md');
   }

   return (
      <div id="sidebar" className="d-flex flex-column p-3 text-bg-dark w-25">
         <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <img src={pic} className="w-50" alt=""></img>
         </Link>
         <hr></hr>
         <Link to="/" className="sidebar-link">
            <SidebarItem 
               name="Workflow repository" 
               setSelected={props.setSelectedPage} 
               selected={props.selectedPage}
            >
               <FaGlobeAmericas />
            </SidebarItem>
         </Link>
         <hr></hr>
         <Link 
            to="/" 
            className="sidebar-link" 
            onClick={window.location.reload}
         >
            <SidebarItem name="Reload">
            </SidebarItem>
         </Link>
         <hr></hr>
         <span className="fs-4 mb-1">Installed Workflows</span>
         <ul className="nav nav-pills flex-column ml-2">
            { renderCategories() }
         </ul>
         <hr></hr>
         <ul className="nav nav-pills flex-column ml-2">
            <li key="Bwb Documentation" className="nav-link text-white border mb-3 sidebar-nav-item sidebar-link" onClick={openBwbDocs}>
               Bwb Documentation
            </li>
         </ul>
         <ul className="nav nav-pills flex-column ml-2">
            <li key="GitPod Documentation" className="nav-link text-white border mb-3 sidebar-nav-item sidebar-link" onClick={openGitPodDocs}>
               GitPod Documentation
            </li>
         </ul>
      </div>
   )
}

export default Sidebar;