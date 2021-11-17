import React, { useState, useEffect } from "react";
import { Image, Box, NativeBaseProvider } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import MarqueeText from "react-native-marquee";

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

export default function Footer({ isPlaying, setIsPlaying, id, setKey, data }) {
    let det;
    const [song, setSong] = useState({});

    function nextSong() {
        let i = data.indexOf(song);
        if (i < data.length - 1) {
            setKey(data[i + 1].key);
            setSong(data[i + 1]);
        }
    }
    function prevSong() {
        let i = data.indexOf(song);
        if (i !== 0) {
            setKey(data[1 - 1].key);
            setSong(data[i - 1]);
        }
    }

    useEffect(() => {
        det = data.find((i) => i.key === id);
        setKey(det.key);
        setSong(det);
    }, [id]);

    return (
        <NativeBaseProvider>
            <Box w="full" alignItems="center" flexDirection="row" safeArea>
                <Image
                    key={Date.now()}
                    source={{
                        uri: song?.albumArtUrl,
                    }}
                    alt="Alternate Text"
                    size="50"
                    m={2}
                />
                <Box w={150}>
                    <Text>{song?.title}</Text>
                    <Text>{song?.album}</Text>
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
                        setIsPlaying(!isPlaying);
                    }}
                >
                    {isPlaying ? (
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
