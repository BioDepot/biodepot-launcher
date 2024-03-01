 /**
 * Checks to see if we have already downloaded the most recent version of the base documentation of BWB
 * If so, does nothing
 * If not, we delete the old version and download the new version
 */

import { useEffect } from 'react';
import { BASE_README_GITHUB_URL, SAVED_BASEDOC_COMMIT_DATE, octokit } from '../constants';
import { filesystem, storage } from "@neutralinojs/lib";

const useBaseDoc = () => {

   /**
    * Checks if we have a local copy of the BWB base README file
    * @return {boolean} - TRUE if we need have a local copy of the file, FALSE otherwise
   */
   const checkIfStored = async () => {
      const keys = await storage.getKeys();
      return keys.includes(SAVED_BASEDOC_COMMIT_DATE);
   };

   /**
    * Checks if we need to download a new version of the base documentation for BWB
    * First checks if we have a local copy to start, if not, we will need to get most recent version
    * If we do have a local copy, then we check if there has been a more recent commit than the one we have
    *    If so, we will need to get most recent version
    * Returns an object containing boolean of whether we need to update and the last commit date of README file
    * @return {boolean, Date} - 
    *    @return {boolean} - TRUE if we need to update the base README file, FALSE otherwise
    *    @return {Date} - The Date of the most recent commit to the README file
    *                         Will be our local version or the date of the repo version, whichever is more recent
   */
   const checkNeedToUpdate = async () => {
      try {
         const storedStatus = await checkIfStored();
         const mostRecentDate = await lastBaseDocCommitDate();
         if (storedStatus) {
            const storedDateInfo = await storage.getData(SAVED_BASEDOC_COMMIT_DATE);
            const storedDate = new Date(storedDateInfo);
            const needToUpdate = storedDate < mostRecentDate;
            return {status: needToUpdate, mostRecentDate: needToUpdate ? mostRecentDate : storedDate};
         } else {
            return {status: true, mostRecentDate: mostRecentDate};
         }
      } catch (e) {
         console.log(e);
      }
   };
   
   /**
    * Makes a request to the Github API for the README.md file corresponding to the workflow and downloads it
    * If the workflow repo has a readme file, it will download and save it as well
   */
   const downloadReadme = async () => {
      const readmeFileLocation = "BioDepot/BioDepot-workflow-builder/contents/README.md";
      try {
         const readmeContent = await octokit.request(`GET /repos/${readmeFileLocation}`);
         await filesystem.writeFile(`./BASEREADME.md`, atob(readmeContent.data.content));
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * Uses Github API to request for the date of the last commit to the README file for the BWB in master branch
    * @return {Date} - The date of the last commit as a Date obj
    */
   const lastBaseDocCommitDate = async () => {
      try {
         const url = "/repos/BioDepot/BioDepot-workflow-builder/commits";
         const request = await octokit.request(`GET ${url}?sha=master&path=README.md&per_page=1`);
         return new Date(request.data[0].commit.committer.date);
      } catch (e) {

      }
   };

   /**
    * Runs the overall code for the hook
    * Must be placed in its own function outside of the `useEffect` call since async functions CANNOT be inside of the `useEffect` call
   */
   const run = async () => {
      try {
         const result = await checkNeedToUpdate();
         const isNeedToUpdate = result.status;
         const mostRecentDate = result.mostRecentDate;
         if (isNeedToUpdate) {
            await downloadReadme();
            await storage.setData(SAVED_BASEDOC_COMMIT_DATE, mostRecentDate.toISOString());
         }
      } catch (e) {
         console.log(e);
      }
   };

   useEffect(() => {
      run();
   }, []);
};

export default useBaseDoc;