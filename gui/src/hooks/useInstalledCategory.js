 /**
 * Gets/Returns the list of installed workflows by the user by category
 * Uses neutralino API to query for local directories
 * @param {string} category - The category of workflows to look for
 * @return {String[]} - The list of local directories as strings that can be used to cross-reference to see if a workflow is installed
 *                      initial value is null
 * @return {FUNCTION} - Function to call to look for workflows under a different category
 */

import { useState, useEffect, useCallback } from 'react';
import { DIRECTORY } from '../constants';
import { filesystem } from "@neutralinojs/lib";

const useInstalledCategory = (category) => {
   // The list of installed workflows under given category
   const [installed, setInstalled] = useState(null);
    /**
    * Gets/Returns the list of installed workflows by the user by category
    * Uses neutralino API to query for local directories
    * @param {string} category - The category of workflows to look for
    */
   const getInstalledState = useCallback(async () => {
      var folderEntries;
      const pwd = (await os.execCommand("pwd")).stdOut.trim();
      try {
         folderEntries = await filesystem.readDirectory(`${pwd}/${category}`);
      } catch (error){
         return;
      }
         // Ignore directory names of .. and .
      const ignoreNames = (x) => x !== ".." && x !== ".";
      const filteredEntries = folderEntries.filter((x) => x.type === DIRECTORY && ignoreNames(x.entry)).map((x) => x.entry);
      setInstalled(filteredEntries);
   }, [category]);

   useEffect(() => {
      getInstalledState();
   }, [getInstalledState]);

   return [installed, getInstalledState];
};

export default useInstalledCategory;