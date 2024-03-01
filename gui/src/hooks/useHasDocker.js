/**
 * Tries to run a docker command to see if the user has installed docker or not
 * If we get back an exit code of 127, means the command is not recognized and we can assume it is not installed
 * Uses neutralino API to run command
 * @return {boolean} - TRUE if we were successfully able to run docker command, FALSE otherwise
 *                     is initially NULL while command is still running
 */

import { useEffect, useState } from 'react';
import { os } from "@neutralinojs/lib";

const useHasDocker = () => {
   const [hasDocker, setHasDocker] = useState(null);
 
   const checkForDocker = async () => {
      const hasDockerCommand = await os.execCommand('docker info');
      setHasDocker(hasDockerCommand.exitCode !== 127);
   };

   useEffect(() => {
      checkForDocker();
   }, []);
 
   return hasDocker;
 };
 
 export default useHasDocker;