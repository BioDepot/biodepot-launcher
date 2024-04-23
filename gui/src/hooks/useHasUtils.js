import { useEffect, useState } from 'react';
import { os } from "@neutralinojs/lib";

const useHasUtils = () => {
    const [hasUtils, setHasUtils] = useState(null);

    const checkForUtils = async () => {
        const hasDockerCommand = await os.execCommand('docker info');

        if (hasDockerCommand.exitCode === 0) {
            const hasUtilsCommand = (await os.execCommand('docker images --format "{{.Repository}}" biodepot/launcher-utils')).stdOut;

            if (hasUtilsCommand.trim() === "biodepot/launcher-utils") {
                const localUtilsDigest = (await os.execCommand('docker inspect --format="{{index .RepoDigests 0}}" biodepot/launcher-utils:1.0')).stdOut.split('@')[1];
                const hubUtilsOut = (await os.execCommand('docker buildx imagetools inspect --format="{{json .Manifest}}" biodepot/launcher-utils:1.0')).stdOut;

                const hubUtilsDigest = JSON.parse(hubUtilsOut)['digest'];

                if (localUtilsDigest.trim() === hubUtilsDigest.trim()) {
                    setHasUtils(true);
                } else {
                    setHasUtils(false);
                }
            } else {
                setHasUtils(false);
            }
        } else {
            setHasUtils(false);
        }
    };

    useEffect(() => {
        checkForUtils();
    }, []);

    return hasUtils;
};

export default useHasUtils;