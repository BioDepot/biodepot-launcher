import { useState, useEffect } from 'react';
import { 
   CATEGORIES, 
   DIRECTORY,
} from '../constants';
import { os, filesystem } from "@neutralinojs/lib";

const useCheckRevert = () => {
   const [needsUpdates, setNeedsUpdates] = useState([]);

   const getWorkflows = async () => {
      // Dict of <CATEGORY, List of installed workflows>
      const output = [];
      for (const category of CATEGORIES) {
         const folderEntries = await filesystem.readDirectory(`./workflows/${category}`);
         // Ignore directory names of .. and .
         const ignoreNames = (x) => x !== ".." && x !== ".";
         const filteredEntries = folderEntries.filter((x) => x.type === DIRECTORY && ignoreNames(x.entry)).map((x) => x.entry);
         for (const name of filteredEntries) {
            let hashOut = "";
            if (window.NL_OS === "Windows") {
               hashOut = (await os.execCommand(`docker run --rm -v .:/workspace/mnt biodepot/launcher-utils:latest "hash" /workspace/mnt/workflows/${category}/${name}`)).stdOut;
            } else {
               hashOut = (await os.execCommand(`docker run --rm -v ".":"/workspace/mnt" biodepot/launcher-utils:latest "hash" /workspace/mnt/workflows/${category}/${name}`)).stdOut;
            }
            const sha = hashOut;
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