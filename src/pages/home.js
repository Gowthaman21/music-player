import React, { useState } from "react";
import Library from "./library";
import { NativeBaseProvider } from "native-base";
import Player from "./player";

const Home = () => {
    const [player, setPlayer] = useState(false);
    return (
        <NativeBaseProvider>
            {!player ? (
                <Library player={player} setPlayer={setPlayer} />
            ) : (
                <Player player={player} setPlayer={setPlayer} />
            )}
        </NativeBaseProvider>
    );
};

export default Home;
