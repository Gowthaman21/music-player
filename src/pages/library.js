import React, { useState, useEffect, useContext } from "react";
import { FlatList, Dimensions } from "react-native";
import {
    NativeBaseProvider,
    Image,
    Text,
    Box,
    Pressable,
    Modal,
    HStack,
} from "native-base";
import Footer from "./play";
import { AudioContext } from "../context/AudioProvider";
import GestureRecognizer from "react-native-swipe-gestures";
import {
    PRIMARY,
    PRIMARY_VAR,
    SECONDARY,
    BACKGROUND,
    BLACK,
    WHITE,
} from "../theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function Options(props) {
    return (
        <Box
            // bgColor="yellow.100"
            w="full"
            px={2}
            py={1}
            border={2}
            borderBottomColor="#707070"
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

export default function Library({ navigation }) {
    const [showModal, setShowModal] = useState({ show: false, key: "" });
    // const [state, setstate] = useState(initialState)

    const context = useContext(AudioContext);

    const onSwipeUp = (gestureState) => {
        console.log("swiped");
        navigation.navigate("player");
        // this.setState({myText: 'You swiped up!'});
    };
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    // useEffect(() => {
    //     console.log("keywss", data[0]?.duration);
    // }, [key]);

    return (
        <NativeBaseProvider>
            <Box flex={1} safeAreaTop bgColor={BLACK}>
                <Text fontSize="3xl" mx={3} bold color={PRIMARY}>
                    Library
                </Text>
                <Menu show={showModal} setShow={setShowModal} />
                <FlatList
                    data={context.details.audioFiles}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => {
                                console.log("item", item.title);

                                context.selectAudio(item.key);
                                // setKey(item.key);
                                // setSongQueued(true);
                            }}
                        >
                            <Box
                                p="2"
                                mb="1"
                                w={windowWidth}
                                flexDirection="row"
                            >
                                <Image
                                    source={{
                                        uri: item.albumArtUrl,
                                    }}
                                    alt="Image"
                                    size={50}
                                    fallbackSource="https://st.depositphotos.com/3538103/5169/i/950/depositphotos_51692599-stock-photo-music-icon-design.jpg"
                                />
                                <Box px="5">
                                    <Text fontSize={"lg"} bold color={WHITE}>
                                        {item.title}
                                    </Text>
                                    <Text color={WHITE}>{item.artist}</Text>
                                </Box>
                            </Box>
                        </Pressable>
                    )}
                />
                {context.details.currentAudioIndex && (
                    <GestureRecognizer
                        onSwipeUp={(state) => onSwipeUp(state)}
                        config={config}
                    >
                        <HStack>
                            <Footer />
                        </HStack>
                    </GestureRecognizer>
                )}
            </Box>
        </NativeBaseProvider>
    );
}
