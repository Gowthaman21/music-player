import React, { useState, useEffect, useContext } from "react";
import { NativeBaseProvider, Box, Image, Text, Flex, View } from "native-base";
import Slider from "@react-native-community/slider";
import { Entypo } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import { AudioContext } from "../context/AudioProvider";

export default function Player() {
    const [currentPosition, setCurrentPosition] = useState(0);
    const context = useContext(AudioContext);

    const { details, changeAudio, pause, moveAudio, selectAudio } = context;
    const calculateSeekBar = () => {
        if (
            details.playbackPosition !== null &&
            details.playbackDuration !== null
        ) {
            return details.playbackPosition / details.playbackDuration;
        }

        if (details.currentAudio.lastPosition) {
            return (
                details.currentAudio.lastPosition /
                (details.currentAudio.duration * 1000)
            );
        }

        return 0;
    };

    async function nextSong() {
        await changeAudio("next");
    }
    async function prevSong() {
        await changeAudio("prev");
    }
    const convertTime = (minutes) => {
        if (minutes) {
            const hrs = minutes / 60;
            const minute = hrs.toString().split(".")[0];
            const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
            const sec = Math.ceil((60 * percent) / 100);
            if (parseInt(minute) < 10 && sec < 10) {
                return `0${minute}:0${sec}`;
            }

            if (sec == 60) {
                return `${minute + 1}:00`;
            }

            if (parseInt(minute) < 10) {
                return `0${minute}:${sec}`;
            }

            if (sec < 10) {
                return `${minute}:0${sec}`;
            }

            return `${minute}:${sec}`;
        }
    };

    const renderCurrentTime = () => {
        if (!details.soundObj && details.currentAudio.lastPosition) {
            return convertTime(details.currentAudio.lastPosition / 1000);
        }
        return convertTime(details.playbackPosition / 1000);
    };

    useEffect(() => {}, [details.currentAudio]);

    return (
        <NativeBaseProvider>
            {/* <Box p="1" safeArea flexDirection="row-reverse">
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.push("timer");
                    }}
                >
                    <Entypo name="stopwatch" size={24} color="black" />
                </TouchableWithoutFeedback>
            </Box> */}

            <Box
                flex={1}
                alignItems="center"
                // justifyContent="center"
                width="full"
            >
                <Text fontSize="lg" mt={9}>
                    {details.currentAudio.album}
                </Text>

                <Image
                    key={Date.now()}
                    source={{
                        uri: details.currentAudio.albumArtUrl,
                    }}
                    alt="Alternate Text"
                    size="300"
                    mt={4}
                />
                <Text fontSize="2xl" mt={5}>
                    {details.currentAudio?.title}
                </Text>
                <Text fontSize="md" mt={-1}>
                    {details.currentAudio?.artist}
                </Text>
                <Box flexDirection="row" w="full" justifyContent="center">
                    <Text fontSize="sm" pt={3}>
                        {currentPosition
                            ? currentPosition
                            : renderCurrentTime()}
                    </Text>
                    <Slider
                        style={{
                            width: "75%",
                            height: 40,
                        }}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeekBar()}
                        thumbTintColor="#ffff00"
                        minimumTrackTintColor="#00ff00"
                        maximumTrackTintColor="#ff4500"
                        onValueChange={(value) => {
                            setCurrentPosition(
                                convertTime(
                                    value * details.currentAudio.duration
                                )
                            );
                        }}
                        onSlidingStart={async () => {
                            if (!details.isPlaying) return;

                            try {
                                await pause();
                            } catch (error) {
                                console.log(
                                    "error inside onSlidingStart callback",
                                    error
                                );
                            }
                        }}
                        onSlidingComplete={async (value) => {
                            await moveAudio(value);
                            setCurrentPosition(0);
                        }}
                    />
                    <Text fontSize="sm" pt={3}>
                        {details.currentAudio?.duration}
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
                                selectAudio(details.currentAudioIndex);
                            }}
                        >
                            {details.isPlaying ? (
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
                {/* <View>
                    <Text fontSize="xs">Up Next</Text>
                    <Text fontSize="md">{upNext.title}</Text>
                    <Text fontSize="xs">{upNext.artist}</Text>
                </View> */}
            </Box>
        </NativeBaseProvider>
    );
}
