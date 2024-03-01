import { useEffect, useState } from 'react';
import { os } from "@neutralinojs/lib";

const useHasDM = () => {
   const [hasDM, setHasDM] = useState(null);

   const checkForDM = async () => {
      const hasAWSCommand = await os.execCommand('docker-machine --version');
      setHasDM(hasAWSCommand.exitCode !== 127);
   };
   
   useEffect(() => {
      checkForDM();
   }, []);

   return hasDM;
};

export default useHasDM;