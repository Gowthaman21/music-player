import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, LogBox } from "react-native";
import { NativeBaseProvider } from "native-base";
import { GiftedChat } from "react-native-gifted-chat";
import "firebase/firestore";
import fb from "../database/firebase";
import { AudioContext } from "../context/AudioProvider";

LogBox.ignoreLogs(["Setting a timer"]);

const db = fb.firestore();
const st = fb.storage().ref();

export default function ChatScreen({ route, navigation }) {
    const [messages, setMessages] = useState([]);
    const tr = true;

    const { roomCode, user } = route.params;

    const { selectMethod } = useContext(AudioContext);

    const Bot = (t) => {
        return {
            _id: 1,
            text: t,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: "TechnoBot",
                avatar: "https://pbs.twimg.com/profile_images/1284959902671093761/tLN43QKJ_400x400.jpg",
            },
        };
    };

    const getLink = async (name) => {
        var test = st.child(name + ".mp3").getDownloadURL();
        return test;
    };

    const unsubscribe = db
        .collection("Chats")
        .doc(roomCode)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
            const threads = querySnapshot.docs.map((docSnapshot) => {
                return {
                    ...docSnapshot.data(),
                    _id: docSnapshot.id,
                    text: docSnapshot.data().text,
                    user: docSnapshot.data().user,
                    createdAt: docSnapshot.data().createdAt.toDate(),
                };
            });

            setMessages(threads);
        });
    useEffect(() => {
        return () => {
            unsubscribe();
        };
    }, []);

    const check = async () => {
        if (messages[0]?.user.name === "TechnoBot") {
            let text = messages[0].text;
            if (text.startsWith("Pausing")) {
                await selectMethod("pause");
            } else if (text === "Resuming") {
                await selectMethod("resume");
            } else if (text.startsWith("Playing")) {
                let eg = text.substring(8);
                let uri = await getLink(eg[1]);
                await selectMethod("play", uri);
            }
        }
    };

    useEffect(() => {
        return () => {
            unsubscribe();
            check();
        };
    }, [messages]);

    const slashPlay = async (messages) => {
        let text = messages[0].text;
        text = text.substring(3);
        let messag = Bot("Playing " + text);
        messages = [messag, ...messages];
        await onSend(messages);
    };

    const slashPause = async (messages) => {
        let messag = Bot("Pausing");
        messages = [messag, ...messages];
        await onSend(messages);
    };

    const slashResume = async (messages) => {
        let messag = Bot("Resuming");
        messages = [messag, ...messages];
        await onSend(messages);
    };

    const slashHelp = (messages) => {
        let messag = Bot(
            "  /p {song_name} => Plays the song \n /pause => Pauses the song \n /resume => Resumes the song \n /leave => Exit the chat"
        );
        messages = [messag, ...messages];
        onSend(messages);
    };

    const slashStop = async (messages) => {
        let messag = Bot("Stoping");
        messages = [messag, ...messages];
        onSend(messages);
    };

    const leave = () => {
        navigation.navigate("home");
        console.log("leave");
    };

    const onSend = useCallback(async (messages = []) => {
        let text = messages[0].text;

        await db
            .collection("Chats")
            .doc(roomCode)
            .collection("messages")
            .add(messages[0]);
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
        if (text.startsWith("/pause")) {
            await slashPause(messages);
        } else if (text === "/resume") {
            await slashResume(messages);
        } else if (text === "/help") {
            await slashHelp(messages);
        } else if (text.startsWith("/p")) {
            console.log("mes", messages);
            await slashPlay(messages);
        } else if (text === "/leave") {
            leave();
        }
    }, []);
    return (
        <NativeBaseProvider>
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}
                    onSend={(messages) => onSend(messages)}
                    renderUsernameOnMessage={tr}
                    showUserAvatar={tr}
                    user={{
                        _id: user,
                        name: user,
                    }}
                />
            </View>
        </NativeBaseProvider>
    );
}
