 /**
 * Gets/Returns the list of installed workflows by the user
 * Uses neutralino API to query for local directories
 * @return {String[]} - The list of local directories as strings that can be used to cross-reference to see if a workflow is installed
 *                      initial value is empty list
 */

import { useState, useEffect } from 'react';
import { DIRECTORY, CATEGORIES } from '../constants';
import { filesystem } from "@neutralinojs/lib";

const useInstalled = () => {
   const [installed, setInstalled] = useState(null);
   const getInstalledState = async () => {
      try {
         let output = {};
         const pwd = (await os.execCommand("pwd")).stdOut.trim();
         for (const category of CATEGORIES) {
            const folderEntries = await filesystem.readDirectory(`${pwd}/${category}`);
            // Ignore directory names of .. and .
            const ignoreNames = (x) => x !== ".." && x !== ".";
            const filteredEntries = folderEntries.filter((x) => x.type === DIRECTORY && ignoreNames(x.entry)).map((x) => x.entry);
            output[category] = filteredEntries;
         }
         setInstalled(output);
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getInstalledState();
   }, []);

   return [installed, getInstalledState];
};

export default useInstalled;