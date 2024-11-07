 /**
 * Checks to see if a given workflow has documentation
 * @param {string} name - The workflow to check documentation for
 * @return {boolean} - TRUE if the workflow has documentation available, FALSE otherwise
 */

import { useEffect, useState } from 'react';
import { README } from '../constants';
import { filesystem } from "@neutralinojs/lib";

const useHasDocu = (name, category) => {
   const [hasDocu, setHasDocu] = useState(null);

    /**
   * Checks if the workflow we have downloaded has a README file inside it since
   * we always download the README file associated if it exists
   * Sets hasDocu to TRUE if README file exists, FALSE otherwise
   */


   useEffect(() => {
      const checkIfDoc = async () => {
         var entries;
         try{
            entries = await filesystem.readDirectory(`./workflows/${category}/${name}`);
         } catch{ 
            setHasDocu("");
            return;
         }
         const fileAvailable = entries.filter((x) => x.entry === README).length > 0;
         setHasDocu(fileAvailable);
      };
      checkIfDoc();
   }, [name,category]);

   return hasDocu;
};

export default useHasDocu;