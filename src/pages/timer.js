import React, { useState, useEffect } from "react";
import { Timer } from "react-native-stopwatch-timer";
import { NativeBaseProvider, Box, Image, Text, Button } from "native-base";
import { TextInput } from "react-native";
export default function SleepTimer() {
    const [start, setStart] = useState(false);
    const [reset, setReset] = useState(false);
    const [time, setTime] = useState(0);
    const [number, onChangeNumber] = React.useState(null);

    const changeTimer = () => {
        setReset(true);
        setTime(number * 60000);
    };
    return (
        <NativeBaseProvider>
            <Box
                p="1"
                safeArea
                justifyContent="center"
                alignContent="center"
                h="full"
            >
                {start === false && (
                    <TextInput
                        onChangeText={onChangeNumber}
                        value={number}
                        placeholder="in mins"
                        keyboardType="numeric"
                        style={{ textAlign: "center", fontSize: 23 }}
                    />
                )}

                <Timer
                    totalDuration={time}
                    start={start}
                    reset={reset}
                    options={options}
                    handleFinish={() => {
                        setStart(false);
                        // setReset(true);
                    }}
                />

                <Button.Group justifyContent="center" alignContent="center">
                    {start === true ? (
                        <>
                            <Button
                                colorScheme="danger"
                                onPress={() => {
                                    setStart(false);
                                }}
                                mr={5}
                            >
                                Stop Timer
                            </Button>
                            <Button
                                colorScheme="danger"
                                onPress={() => {
                                    setStart(false);
                                    setReset(true);
                                }}
                            >
                                Reset Timer
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                colorScheme="danger"
                                onPress={() => {
                                    setStart(!start);
                                }}
                                mr={5}
                            >
                                Start Timer
                            </Button>
                            <Button colorScheme="teal" onPress={changeTimer}>
                                Set Timer
                            </Button>
                        </>
                    )}
                </Button.Group>
            </Box>
        </NativeBaseProvider>
    );
}

const options = {
    container: {
        backgroundColor: "#ff",
    },
    text: {
        textAlign: "center",
        fontSize: 20,
        color: "#000",
    },
};
