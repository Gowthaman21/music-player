import React, { useState, useEffect, createContext } from "react";
import { getPermission } from "../api/GetPermission";
import { Audio } from "expo-av";
export const AudioContext = createContext();

const AudioProvider = ({ children }) => {
    const [playList, setplayList] = useState([]);
    const [addToPlayList, setaddToPlayList] = useState(null);
    const [isPlayListRunning, setisPlayListRunning] = useState(false);
    const [activePlayList, setactivePlayList] = useState([]);

    const [details, setDetails] = useState({
        audioFiles: [],
        playbackObj: null,
        soundObj: null,
        currentAudio: {},
        isPlaying: false,
        currentAudioIndex: "",
        playbackPosition: null,
        playbackDuration: null,
        totalAudioCount: 0,
    });

    const handleChange = async (newState) => {
        setDetails((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    useEffect(() => {
        getFiles();
    }, []);

    const onPlaybackStatusUpdate = async (playbackStatus) => {
        // console.log("currentIndex", playbackStatus.uri);
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            handleChange({
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            });
            // setplaybackPosition(playbackStatus.positionMillis);
            // setplaybackDuration(playbackStatus.durationMillis);
        }
        if (playbackStatus.didJustFinish) {
            handleChange({ isPlaying: false });
        }
    };

    const play = async (uri, lastPosition) => {
        try {
            console.log("uri", uri);

            if (!lastPosition)
                return await details.playbackObj.loadAsync(
                    { uri },
                    { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
                );

            // but if there is lastPosition then we will play audio from the lastPosition
            await details.playbackObj.loadAsync(
                { uri },
                { progressUpdateIntervalMillis: 1000 }
            );

            return await details.playbackObj.playFromPositionAsync(
                lastPosition
            );
        } catch (error) {
            console.log("error inside play helper method", error.message);
        }
    };

    const pause = async () => {
        try {
            return await details.playbackObj.setStatusAsync({
                shouldPlay: false,
            });
        } catch (error) {
            console.log("error inside pause helper method", error.message);
        }
    };

    const resume = async () => {
        try {
            return await details.playbackObj.setStatusAsync({
                shouldPlay: true,
            });
        } catch (error) {
            console.log("error inside resume helper method", error.message);
        }
    };

    const playNext = async (uri) => {
        try {
            await details.playbackObj.stopAsync();
            await details.playbackObj.unloadAsync();
            return await play(uri);
        } catch (error) {
            console.log("error inside playNext helper method", error.message);
        }
    };

    const selectAudio = async (key) => {
        try {
            console.log("key", key);

            let det = details.audioFiles.find((i) => i.key === key.toString());
            console.log("song", det.audioUrl);

            if (details.soundObj === null) {
                // playing for first time
                console.log("hhhh", det.audioUrl);
                const status = await play(det.audioUrl);

                // setcurrentAudio(det);
                // setcurrentAudioIndex(det.key);
                // setsoundObj(status);
                // setisPlaying(true);
                await handleChange({
                    currentAudio: det,
                    currentAudioIndex: det.key,
                    soundObj: status,
                    isPlaying: true,
                });
                details.playbackObj.setOnPlaybackStatusUpdate(
                    onPlaybackStatusUpdate
                );
                return;
            }

            if (
                //pause Audio
                details.soundObj.isLoaded &&
                details.soundObj.isPlaying &&
                details.currentAudioIndex === det.key
            ) {
                const status = await pause();
                // setsoundObj(status);
                // setisPlaying(false);
                // setplaybackPosition(status.positionMillis);
                handleChange({
                    currentAudio: det,
                    currentAudioIndex: det.key,
                    soundObj: status,
                    isPlaying: false,
                });
                return;
            }

            if (
                details.soundObj.isLoaded &&
                !details.soundObj.isPlaying &&
                details.currentAudioIndex === det.key
            ) {
                const status = await resume();
                // setsoundObj(status);
                // setisPlaying(true);
                handleChange({
                    soundObj: status,
                    isPlaying: true,
                });
                return;
            }

            if (
                details.soundObj.isLoaded &&
                details.currentAudioIndex !== det.key
            ) {
                //select another file
                const status = await playNext(det.audioUrl);
                console.log("status", status);
                handleChange({
                    currentAudio: det,
                    currentAudioIndex: det.key,
                    soundObj: status,
                    isPlaying: true,
                });
                return;
                // setcurrentAudio(det);
                // setcurrentAudioIndex(det.key);
                // setsoundObj(status);
                // setisPlaying(true);
            }
        } catch (error) {
            console.log("error inside select audio method.", error.message);
        }
    };

    const getFiles = async () => {
        let val = await getPermission();
        if (val.done === true) {
            // setplaybackObj(new Audio.Sound());
            // setaudioFiles(val.final);
            handleChange({
                playbackObj: new Audio.Sound(),
                audioFiles: val.final,
            });
        }
        // setaudioFiles(await getPermission());
    };

    const changeAudio = async (select) => {
        const { isLoaded } = await details.playbackObj.getStatusAsync();
        const isLastAudio =
            (Number(details.currentAudioIndex) + 1).toString() ===
            details.totalAudioCount;
        const isFirstAudio = details.currentAudioIndex <= 10;

        let audio;
        let index;
        let status;
        try {
            if (select === "next") {
                audio = details.audioFiles.find(
                    (i) =>
                        i.key ===
                        (Number(details.currentAudioIndex) + 1).toString()
                );
                if (!isLoaded && !isLastAudio) {
                    index = (Number(details.currentAudioIndex) + 1).toString();
                    status = await play(audio.audioUrl);
                    details.playbackObj.setOnPlaybackStatusUpdate(
                        details.onPlaybackStatusUpdate
                    );
                }

                if (isLoaded && !isLastAudio) {
                    index = (Number(details.currentAudioIndex) + 1).toString();
                    status = await playNext(audio.audioUrl);
                }

                if (isLastAudio) {
                    index = 0;
                    audio = details.audioFiles[index];
                    if (isLoaded) {
                        status = await playNext(audio.audioUrl);
                    } else {
                        status = await play(audio.audioUrl);
                    }
                }
            }
            if (select === "prev") {
                audio = details.audioFiles.find(
                    (i) =>
                        i.key ===
                        (Number(details.currentAudioIndex) - 1).toString()
                );

                if (!isLoaded && !isFirstAudio) {
                    index = details.currentAudioIndex - 1;
                    status = await play(audio.audioUrl);
                    details.playbackObj.setOnPlaybackStatusUpdate(
                        onPlaybackStatusUpdate
                    );
                }

                if (isLoaded && !isFirstAudio) {
                    index = details.currentAudioIndex - 1;
                    status = await playNext(audio.audioUrl);
                }

                if (isFirstAudio) {
                    index = details.totalAudioCount - 1;
                    audio = details.audioFiles[index];
                    if (isLoaded) {
                        status = await playNext(audio.audioUrl);
                    } else {
                        status = await play(audio.audioUrl);
                    }
                }
            }
            handleChange({
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
                playbackPosition: null,
                playbackDuration: null,
            });
            // setcurrentAudio(audio);
            // setsoundObj(status);
            // setisPlaying(true);
            // setcurrentAudioIndex(index);
            // setplaybackPosition(null);
            // setplaybackDuration(null);
        } catch (error) {
            console.log("error inside change audio method.", error.message);
        }
    };

    const moveAudio = async (value) => {
        if (details.soundObj === null || !details.isPlaying) return;

        try {
            const status = await details.playbackObj.setPositionAsync(
                Math.floor(details.soundObj.durationMillis * value)
            );
            // setsoundObj(status);
            // setplaybackPosition(status.positionMillis);
            handleChange({
                soundObj: status,
                playbackPosition: status.positionMillis,
            });

            await resume();
        } catch (error) {
            console.log("error inside onSlidingComplete callback", error);
        }
    };

    useEffect(() => {
        // settotalAudioCount(audioFiles.length);
        // details.audioFiles.map((i) => {
        //     console.log("file", i.key, i.title, i.audioUrl);
        // });
        handleChange({ totalAudioCount: details.audioFiles.length });
    }, [details.audioFiles]);

    return (
        <AudioContext.Provider
            value={{
                playList,
                addToPlayList,
                isPlayListRunning,
                activePlayList,
                details,
                selectAudio,
                changeAudio,
                pause,
                moveAudio,
                onPlaybackStatusUpdate,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export default AudioProvider;
