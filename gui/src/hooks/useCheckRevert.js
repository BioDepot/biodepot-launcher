import { useState, useEffect, useCallback } from 'react';
import { 
   CATEGORIES, 
   DIRECTORY,
} from '../constants';
import { os, filesystem } from "@neutralinojs/lib";

const useCheckRevert = () => {
   const [needsUpdates, setNeedsUpdates] = useState(null);

   const getWorkflows = async () => {
      // Dict of <CATEGORY, List of installed workflows>
      const output = [];
      for (const category of CATEGORIES) {
         const folderEntries = await filesystem.readDirectory(`./${category}`);
         // Ignore directory names of .. and .
         const ignoreNames = (x) => x !== ".." && x !== ".";
         const filteredEntries = folderEntries.filter((x) => x.type === DIRECTORY && ignoreNames(x.entry)).map((x) => x.entry);
         for (const name of filteredEntries) {
            const hashOut = (await os.execCommand(`scripts/hash.sh ${category}/${name}`));
            const sha = hashOut.stdOut;
            output.push({
               category,
               name,
               sha
            });
         }
      }
      return output;
   };

   const getSavedHash = async (category, name) => {
        return await filesystem.readFile(`./.storage/${category}-${name}`);
   };

   const getCompareHashes = async () => {
      const installedWorkflows = await getWorkflows(); 
      const output = [];

      for (let workflow of installedWorkflows) {
         const savedHash = await getSavedHash(workflow.category, workflow.name);
         
         if (workflow.sha.trim() !== savedHash.trim()) {
            output.push(workflow);
         }
      }

      setNeedsUpdates(output.map((workflow) => [workflow.category, workflow.name]));       
   };

   useEffect(() => {    
      getCompareHashes();
   }, []);

   return needsUpdates;
};

export default useCheckRevert;