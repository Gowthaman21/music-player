import React from "react";
import AudioProvider from "./src/context/AudioProvider";
import Routes from "./routes";

export default function App() {
    return (
        <AudioProvider>
            <Routes />
        </AudioProvider>
    );
}
