/**
* Tries to run a docker command to see if the user has installed docker or not
* If we get back an exit code of 127, means the command is not recognized and we can assume it is not installed
* Uses neutralino API to run command
* @return {boolean} - TRUE if we were successfully able to run docker command, FALSE otherwise
*                     is initially NULL while command is still running
*/

import { useEffect, useState } from 'react';
import { os } from "@neutralinojs/lib";

const useHasBwb = () => {
    const [hasBwb, setHasBwb] = useState(null);

    const checkForBwb = async () => {
        const hasBwbCommand = (await os.execCommand('docker images | grep -c biodepot/bwb')).stdOut;
        
        if (hasBwbCommand > 0) {
            const localBwbDigest = (await os.execCommand(`docker inspect --format='{{index .RepoDigests 0}}' biodepot/bwb`)).stdOut.split(':')[1];
            const hubBwbDigest = (await os.execCommand(`docker buildx imagetools inspect biodepot/bwb:latest | grep "Digest:"`)).stdOut.split(':')[2];

            if (hubBwbDigest === localBwbDigest) {
                setHasBwb(true);
            } else {
                setHasBwb(false);
            }
        } else {
            setHasBwb(false);
        }
    };

    useEffect(() => {
        checkForBwb();
    }, []);

    return hasBwb;
};

export default useHasBwb;