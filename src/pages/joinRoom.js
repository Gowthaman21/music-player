import {
    FormControl,
    Input,
    NativeBaseProvider,
    VStack,
    Center,
    Button,
    Box,
    Text,
} from "native-base";
import React, { useState } from "react";
import {
    PRIMARY,
    BACKGROUND,
    BLACK,
    WHITE,
} from "../theme";

const JoinRoom = ({ navigation }) => {
    const [search, setSearch] = useState({
        roomCode: "",
        user: "",
    });
    const handleChange = async (newState) => {
        setSearch((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    return (
        <NativeBaseProvider>
            <Box bg={BLACK} safeAreaTop flex={1}>
                <Center flex={1}>
                    <Text fontSize="2xl" bold color={PRIMARY}>
                        Join Room
                    </Text>

                    <VStack width="85%" mx="3">
                        <FormControl>
                            <FormControl.Label
                                _text={{ bold: true, color: WHITE }}
                            >
                                Room Code
                            </FormControl.Label>
                            <Input
                                onChangeText={(value) => {
                                    handleChange({ roomCode: value });
                                }}
                                borderWidth={"2"}
                                fontSize="md"
                                fontWeight="bold"
                                style={{
                                    color: WHITE,
                                    backgroundColor: BACKGROUND,
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label
                                _text={{ bold: true, color: WHITE }}
                            >
                                Your name
                            </FormControl.Label>
                            <Input
                                onChangeText={(value) => {
                                    handleChange({ user: value });
                                }}
                                borderWidth={"2"}
                                fontSize="md"
                                fontWeight="bold"
                                style={{
                                    color: WHITE,
                                    backgroundColor: BACKGROUND,
                                }}
                            />
                        </FormControl>
                        <Button
                            onPress={() => {
                                if (
                                    search.roomCode !== "" &&
                                    search.user !== ""
                                ) {
                                    navigation.navigate("chat", {
                                        roomCode: search.roomCode,
                                        user: search.user,
                                    });
                                }
                            }}
                            mt="5"
                            _text={{
                                fontWeight: "bold",
                                fontSize: "xl",
                            }}
                            w={"40"}
                            mx="auto"
                        >
                            Create/Join
                        </Button>
                    </VStack>
                </Center>
            </Box>
        </NativeBaseProvider>
    );
};

export default JoinRoom;
