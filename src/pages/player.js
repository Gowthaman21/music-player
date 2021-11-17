import React, { useState, useEffect } from "react";
import {
    NativeBaseProvider,
    Box,
    Image,
    Text,
    Slider,
    Flex,
    View,
} from "native-base";
import { Entypo } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";

export default function Player({ isPlaying, setIsPlaying, id, setKey, data }) {
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
            <Box p="1" safeArea flexDirection="row-reverse">
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.push("timer");
                    }}
                >
                    <Entypo name="stopwatch" size={24} color="black" />
                </TouchableWithoutFeedback>
            </Box>

            <Box
                flex={1}
                alignItems="center"
                // justifyContent="center"
                width="full"
            >
                <Text fontSize="lg" mt={9}>
                    {song.album}
                </Text>

                <Image
                    key={Date.now()}
                    source={{
                        uri: song.albumArtUrl,
                    }}
                    alt="Alternate Text"
                    size="300"
                    mt={4}
                />
                <Text fontSize="2xl" mt={5}>
                    {song?.title}
                </Text>
                <Text fontSize="md" mt={-1}>
                    {song?.artist}
                </Text>
                <Box flexDirection="row" w="full" justifyContent="center">
                    <Text fontSize="sm" pt={5} mr={3}>
                        0:00
                    </Text>
                    <Slider defaultValue={0} size="sm" mt={5} w="75%">
                        <Slider.Track bg="grey">
                            <Slider.FilledTrack bg="black" />
                        </Slider.Track>
                        <Slider.Thumb bg="grey" />
                    </Slider>
                    <Text fontSize="sm" pt={5} ml={3}>
                        {song?.duration}
                    </Text>
                </Box>

                <View>
                    <Flex
                        direction={"row"}
                        align={"center"}
                        justifyContent="center"
                        mt={5}
                    >
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
                                    style={{ marginHorizontal: 40 }}
                                    color="black"
                                />
                            ) : (
                                <Entypo
                                    name="controller-play"
                                    size={42}
                                    style={{ marginHorizontal: 40 }}
                                    color="black"
                                />
                            )}
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={nextSong}>
                            <Entypo
                                name="controller-next"
                                size={42}
                                color="black"
                            />
                        </TouchableWithoutFeedback>
                    </Flex>
                </View>
            </Box>
        </NativeBaseProvider>
    );
}
