import React, { useState, useEffect } from "react";
import Library from "./library";
import { NativeBaseProvider } from "native-base";
import { getPermission } from "../api/GetPermission";
import { Audio } from "expo-av";

const Home = () => {
    const [details, setDetails] = useState([]);
    const playbackObject = new Audio.Sound();
    
    useEffect(() => {
        getFiles();
    }, []);

    const getFiles = async () => {
        setDetails(await getPermission());
    };

    useEffect(() => {}, [details]);

    return (
        <NativeBaseProvider>
            <Library
                data={details}
            />
        </NativeBaseProvider>
    );
};

export default Home;
