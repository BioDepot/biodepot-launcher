import { useState, useEffect } from 'react';

const useGetFileDetails = () => {
    const [fileDetails, setFileDetails] = useState(null);

    const getFileDetails = async () => {
        const response = await fetch("https://raw.githubusercontent.com/Biodepot-workflows/launcher-selection/main/files.txt");
        const text = await response.text();

        let files = [];
        text.split('\n').forEach( (line) => files.push(line.split(' ')) );

        setFileDetails(files);
    };


    useEffect( () => {
        getFileDetails();
    }, []);

    return fileDetails;
};

export default useGetFileDetails;