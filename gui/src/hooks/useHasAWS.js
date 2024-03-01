import { useEffect, useState } from 'react';
import { os } from "@neutralinojs/lib";

const useHasAWS = () => {
   const [hasAWS, setHasAWS] = useState(null);

   const checkForAWS = async () => {
      const hasAWSCommand = await os.execCommand('aws --version');
      setHasAWS(hasAWSCommand.exitCode !== 127);
   };
   
   useEffect(() => {
      checkForAWS();
   }, []);

   return hasAWS;
};

export default useHasAWS;