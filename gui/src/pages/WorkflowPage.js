/**
 * Renders the base Workflow page
 * @prop {string} selectedPage - The selected workflow category to render
 */

import Workflow from '../components/Workflow';
import useInstalledCategory from '../hooks/useInstalledCategory';
import NoWorkflowsModal from '../components/NoWorkflowsModal';

function WorkflowPage(props) {
   const [installedList, _] = useInstalledCategory(props.selectedPage);

    /**
    * Returns the render list of installed workflows
    * @return {JSX} - List of installed workflows
    */
   
   const renderWorkflows = () => {
      return installedList !== null && props.needsUpdates !== null ? installedList.map((workflow, idx) => 
         <Workflow
            category={props.selectedPage}
            key={workflow} 
            name={workflow} 
            updated={!check(props.needsUpdates, props.selectedPage, workflow)}
            revert={!check(props.canRevert, props.selectedPage, workflow)}
            fileDetails={props.fileDetails}
            needsUpdates={props.needsUpdates}
            canRevert={props.canRevert}
            hasBwb={props.hasBwb}
            hasDocker={props.hasDocker}
         />
      ) : null;
   };

   // Checks if the list contains valuese that need to be flagged
   const check = (list, selectedPage, workflow) => {
      for (let n of list) {
         if (n[0] === selectedPage && n[1] === workflow) {
            return true;
         }
      }

      return false;
   };

   return (
      <div className="p-3">
         { installedList !== null ? <NoWorkflowsModal show={installedList.length === 0} /> : null }
         <h1 className="border-bottom">Installed</h1>
         <table className="table">
            <thead>
               <tr>
                  <th scope="col">Workflow Name</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col">{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</th>
                  <th scope="col">{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</th>
               </tr>
            </thead>
            <tbody>
               { renderWorkflows() }
            </tbody>
         </table>
      </div>
   );
};

export default WorkflowPage;