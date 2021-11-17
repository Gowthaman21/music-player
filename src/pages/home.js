import React, { useState, useEffect } from "react";
import Library from "./library";
import { NativeBaseProvider } from "native-base";
import { getPermission } from "../api/GetPermission";

const Home = () => {
    const [details, setDetails] = useState([]);
    useEffect(() => {
        getFiles();
    }, []);

    const getFiles = async () => {
        setDetails(await getPermission());
    };

    useEffect(() => {}, [details]);

    return (
        <NativeBaseProvider>
            <Library data={details} />
        </NativeBaseProvider>
    );
};

export default Home;
