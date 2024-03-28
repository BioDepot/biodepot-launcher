import { useState, useEffect } from 'react';
import { 
   CATEGORIES, 
   DIRECTORY,
} from '../constants';
import { filesystem } from "@neutralinojs/lib";

const useWorkflowUpdates = () => {

   const [needsUpdates, setNeedsUpdates] = useState([]);

   const getWorkflows = async () => {
      // Dict of <CATEGORY, List of installed workflows>
      const output = [];
      for (const category of CATEGORIES) {
         const folderEntries = await filesystem.readDirectory(`./${category}`);
         // Ignore directory names of .. and .
         const ignoreNames = (x) => x !== ".." && x !== ".";
         const filteredEntries = folderEntries.filter((x) => x.type === DIRECTORY && ignoreNames(x.entry)).map((x) => x.entry);
         for (const name of filteredEntries) {
            output.push({
               category,
               name,
            });
         }
      }
      return output;
   };

   const getSavedHash = async (category, name) => {
        return await filesystem.readFile(`./.storage/${category}-${name}`);
   };

   useEffect(() => {
      const getCompareHashes = async () => {
         const installedWorkflows = await getWorkflows();
         const response = await fetch("https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/hash.txt");
         const text = await response.text();
   
         let hashDetails = [];
         text.split('\n').forEach( (line) => hashDetails.push(line.split(' ')) );
   
         const output = [];
   
         for (let workflow of installedWorkflows) {
            for (let h of hashDetails) {
               if (`./${workflow.category}/${workflow.name}` === h[1].trim()) {
                  const savedHash = await getSavedHash(workflow.category, workflow.name);
   
                  if (savedHash.trim() !== h[0]) {
                     output.push(workflow);
                     break;
                  }
               }
            }
         }
      
         setNeedsUpdates(output.map((workflow) => [workflow.category, workflow.name]));         
      };

      getCompareHashes();
   }, []);

   return needsUpdates;
   
};

export default useWorkflowUpdates;