import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import {
    NativeBaseProvider,
    Image,
    Text,
    Box,
    Pressable,
    Modal,
} from "native-base";
import Footer from "./play";
import SwipeUpDown from "react-native-swipe-up-down";
import Player from "./player";

function Options(props) {
    return (
        <Box
            bgColor="yellow.100"
            w="full"
            px={2}
            py={1}
            border={2}
            borderBottomColor="red.100"
            borderBottomWidth={2}
            {...props}
        />
    );
}

function Menu({ show, setShow }) {
    return (
        <Modal
            isOpen={show.show}
            onClose={() => setShow({ show: false, key: "" })}
        >
            <Modal.Content>
                <Modal.Body p={0}>
                    <Options>
                        <Text fontSize="xl">Play </Text>
                    </Options>
                    <Options>
                        <Text fontSize="xl">Play Next </Text>
                    </Options>
                    <Options>
                        <Text fontSize="xl">Add To Queue</Text>
                    </Options>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

export default function Library({ data }) {
    const [showModal, setShowModal] = useState({ show: false, key: "" });
    const [songQueued, setSongQueued] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [key, setKey] = useState("");

    useEffect(() => {
        console.log("keywss", data[0]?.duration);
    }, [key]);

    return (
        <NativeBaseProvider>
            <Box flex={1} safeArea bgColor="white">
                <Text fontSize="3xl" mx={3} bold>
                    Library
                </Text>
                <Menu show={showModal} setShow={setShowModal} />
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <Pressable
                            onLongPress={() => {
                                setShowModal({ show: true, key: item.key });
                            }}
                            onPress={() => {
                                setKey(item.key);
                                setSongQueued(true);
                            }}
                        >
                            <Box
                                p="2"
                                mb="1"
                                w="350"
                                flexDirection="row"
                                border={2}
                                borderColor="red.300"
                                borderBottomWidth={2}
                            >
                                <Image
                                    source={{
                                        uri: item.albumArtUrl,
                                    }}
                                    alt="Alternate Text"
                                    size={50}
                                />
                                <Box px="5">
                                    <Text fontSize={"lg"} bold>
                                        {item.title}
                                    </Text>
                                    <Text>{item.artist}</Text>
                                </Box>
                            </Box>
                        </Pressable>
                    )}
                />

                {key && (
                    <SwipeUpDown
                        itemMini={
                            <Footer
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                id={key}
                                setKey={setKey}
                                data={data}
                            />
                        }
                        itemFull={
                            <Player
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                id={key}
                                setKey={setKey}
                                data={data}
                            />
                        } // Pass props component when show full
                        // onShowMini={() => console.log("mini")}
                        // onShowFull={() => console.log("full")}
                        // onMoveDown={() => console.log("down")}
                        // onMoveUp={() => console.log("up")}
                        disablePressToShow={false} // Press item mini to show full
                        // animation="spring"
                        style={{
                            backgroundColor: "white",
                            padding: 0,
                        }}
                    />
                )}
            </Box>
        </NativeBaseProvider>
    );
}
