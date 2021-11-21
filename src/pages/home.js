import React, { useState, useEffect } from "react";
import Library from "./library";
import { NativeBaseProvider } from "native-base";
import { getPermission } from "../api/GetPermission";
import { Audio } from "expo-av";

const Home = () => {
    return (
        <NativeBaseProvider>
            <Library />
        </NativeBaseProvider>
    );
};

export default Home;
