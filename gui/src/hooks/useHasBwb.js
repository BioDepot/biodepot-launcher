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
        alert("Step 0");
        const hasDockerCommand = await os.execCommand('docker info');

        alert("Step 1");
        if (hasDockerCommand.exitCode === 0) {
            const hasBwbCommand = (await os.execCommand('docker images --format "{{.Repository}}" biodepot/bwb')).stdOut;

            alert("Step 2");
            if (hasBwbCommand.trim() === "biodepot/bwb") {
                const localBwbDigest = (await os.execCommand(`docker inspect --format='{{index .RepoDigests 0}}' biodepot/bwb`)).stdOut.split('@')[1];
                alert("Step 3");
                const hubBwbOut = (await os.execCommand(`docker buildx imagetools inspect --format='{{json .Manifest}}' biodepot/bwb:latest`)).stdOut;
                alert("Step 4");
                alert(hubBwbOut);

                const hubBwbDigest = JSON.parse(hubBwbOut)['digest'];
                alert("Step 5");

                if (localBwbDigest.trim() === hubBwbDigest.trim()) {
                    alert("Bwb found");
                    setHasBwb(true);
                } else {
                    alert("Bwb not found");
                    setHasBwb(false);
                }
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