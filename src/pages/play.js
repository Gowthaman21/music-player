import React, { useState, useEffect, useContext } from "react";
import { Image, Box, NativeBaseProvider } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import MarqueeText from "react-native-marquee";
import { AudioContext } from "../context/AudioProvider";

function Text(props) {
    return (
        <MarqueeText
            style={{ fontSize: 16 }}
            duration={1000}
            marqueeOnStart
            loop
            marqueeDelay={1000}
            marqueeResetDelay={1000}
            {...props}
        />
    );
}

export default function Footer() {
    const context = useContext(AudioContext);

    const { changeAudio, details, selectAudio } = context;

    async function nextSong() {
        await changeAudio("next");
    }
    async function prevSong() {
        await changeAudio("prev");
    }

    useEffect(() => {}, [details.currentAudio]);

    return (
        <NativeBaseProvider>
            <Box w="full" alignItems="center" flexDirection="row" safeArea>
                <Image
                    key={Date.now()}
                    source={{
                        uri: details.currentAudio?.albumArtUrl,
                    }}
                    alt="Alternate Text"
                    size="50"
                    m={2}
                    fallbackSource="https://st.depositphotos.com/3538103/5169/i/950/depositphotos_51692599-stock-photo-music-icon-design.jpg"
                />
                <Box w={150}>
                    <Text>{details.currentAudio?.title}</Text>
                    <Text>{details.currentAudio?.album}</Text>
                </Box>
                <TouchableWithoutFeedback onPress={prevSong}>
                    <Entypo
                        name="controller-jump-to-start"
                        size={42}
                        color="black"
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => {
                        selectAudio(details.currentAudioIndex);
                    }}
                >
                    {details.isPlaying ? (
                        <Entypo
                            name="controller-paus"
                            size={42}
                            color="black"
                        />
                    ) : (
                        <Entypo
                            name="controller-play"
                            size={42}
                            color="black"
                        />
                    )}
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={nextSong}>
                    <Entypo name="controller-next" size={42} color="black" />
                </TouchableWithoutFeedback>
            </Box>
        </NativeBaseProvider>
    );
}
