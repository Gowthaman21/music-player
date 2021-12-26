import React from "react";
import { NativeBaseProvider, Box, Center, Pressable } from "native-base";
import { Dimensions } from "react-native";
import {
    PRIMARY,
    PRIMARY_VAR,
    SECONDARY,
    BACKGROUND,
    BLACK,
    WHITE,
} from "../theme";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

const Home = ({ navigation }) => {
    const Example = (props) => {
        return (
            <Box
                m={3}
                rounded={"xl"}
                shadow={9}
                bg={BACKGROUND}
                overflow="hidden"
                p="2"
                mb="1"
                w={windowWidth * 0.6}
                h={windowWidth * 0.2}
                justifyContent="center"
                alignItems="center"
                _text={{
                    fontSize: "xl",
                    color: WHITE,
                    fontWeight: "bold",
                }}
                {...props}
            />
        );
    };

    return (
        <NativeBaseProvider>
            <Box safeAreaTop flex={1} bg={BLACK}>
                <Center flex={1}>
                    <Box flexDirection="column">
                        <Pressable
                            onPress={() => {
                                navigation.navigate("library");
                            }}
                        >
                            <Example>Offline</Example>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                navigation.navigate("room");
                            }}
                        >
                            <Example>Online</Example>
                        </Pressable>
                    </Box>
                </Center>
            </Box>
        </NativeBaseProvider>
    );
};

export default Home;
