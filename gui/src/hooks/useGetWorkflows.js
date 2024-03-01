 /**
 * Uses Github API to request for all of the workflows under a given category
 * Uses neutralino API to query for local directories
 * @return {String[]} - The list of local directories as strings that can be used to cross-reference to see if a workflow is installed
 *                      initial value is empty list
 */

import { useState, useEffect } from 'react';

function useGetWorkflows(category, fileDetails) {
   const [workflows, setWorkflows] = useState([]);

   /**
   * Uses Github API to request for all of the workflows under a given category
   * Uses neutralino API to query for local directories
   * @return {String[]} - The list of local directories as strings that can be used to cross-reference to see if a workflow is installed
   */

   useEffect(() => {
      const makeWorkflowCategoryRequest = () => {
         let workflowFolders = [];
   
         for (let f of fileDetails) {
            
            if (f[0] === 'tree') {
               const file = f[1];   
               
               if (file.startsWith(category)) {
                  const splitFile = file.split('/');
   
                  if (splitFile.length === 2 && !splitFile[1].startsWith('.')) {
                     if (splitFile[1] !== 'images')
                        workflowFolders.push(splitFile[1]);
                  }
               }
            }
         }
   
         setWorkflows(workflowFolders);
      };

      makeWorkflowCategoryRequest();
   }, [category, fileDetails]);

   return workflows;
};

export default useGetWorkflows;