 /**
 * Renders the workflow marketplace page for downloading workflows and seeing what is available
 */

import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import MarketWorkflow from '../components/MarketWorkflow';
import useGetWorkflows from '../hooks/useGetWorkflows';
import { CATEGORIES } from '../constants';
import useInstalledCategory from '../hooks/useInstalledCategory';

function MarketplacePage(props) {
   // the selected workflow category for downloading
   const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
   const workflows = useGetWorkflows(selectedCategory, props.fileDetails);
   const [installedList, getInstalled] = useInstalledCategory(selectedCategory);

   // Updates the install status
   const update = () => {
      getInstalled(selectedCategory);
   };

   // Changes the selected category to view workflows under for installation
   const changeCategory = (category) => {
      getInstalled(category);
      setSelectedCategory(category);
   };

   /**
    * Renders all of the workflow category options
   */
   const renderCategories = () => {
      return CATEGORIES.map( (category) => 
         (
            <ListGroup.Item 
               className="market-nav-item" 
               onClick={() => changeCategory(category)} 
               key={category}
               id={selectedCategory === category ? 'selected-market' : ''}
            >
               { category }
            </ListGroup.Item>
         )
      );
   };

   /**
   * Renders all of the workflows belonging to a workflow category
   */
   const renderWorkflows = () => {
      return installedList !== null ? workflows.map((workflow, idx) => 
         <MarketWorkflow 
            key={workflow} 
            name={workflow} 
            installed={installedList.includes(workflow)}
            category={selectedCategory}
            update={update}
            fileDetails={props.fileDetails}
         />
      ) : null;
   };

   return (
      <div className="p-3">
         <h1 className="border-bottom">Workflow repository</h1>
         <span className="text-muted">Click on a workflow category below</span>
         <ListGroup horizontal>
            { renderCategories() }
         </ListGroup>
         <table className="table">
            <thead>
               <tr>
                  <th scope="col">Workflow Name</th>
                  <th scope="col">Install Status</th>
               </tr>
            </thead>
            <tbody>
               { renderWorkflows() }
            </tbody>
         </table>
      </div>
   );
};

export default MarketplacePage;