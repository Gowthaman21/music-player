import React, { useState, useEffect, createContext } from "react";
import { getPermission } from "../api/GetPermission";
import { Audio } from "expo-av";
export const AudioContext = createContext();

const AudioProvider = ({ children }) => {
    const [audioFiles, setaudioFiles] = useState([]);
    const [playList, setplayList] = useState([]);
    const [addToPlayList, setaddToPlayList] = useState(null);
    const [playbackObj, setplaybackObj] = useState(null);
    const [soundObj, setsoundObj] = useState(null);
    const [currentAudio, setcurrentAudio] = useState({});
    const [isPlaying, setisPlaying] = useState(false);
    const [isPlayListRunning, setisPlayListRunning] = useState(false);
    const [activePlayList, setactivePlayList] = useState([]);
    const [currentAudioIndex, setcurrentAudioIndex] = useState("");
    const [playbackPosition, setplaybackPosition] = useState(null);
    const [playbackDuration, setplaybackDuration] = useState(null);
    const [totalAudioCount, settotalAudioCount] = useState(0);

    const toggleisPlaying = () => setisPlaying(!isPlaying);
    useEffect(() => {
        getFiles();
    }, []);

    const onPlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            setplaybackPosition(playbackStatus.positionMillis);
            setplaybackDuration(playbackStatus.durationMillis);
        }

        // if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
        //   storeAudioForNextOpening(
        //     this.state.currentAudio,
        //     this.state.currentAudioIndex,
        //     playbackStatus.positionMillis
        //   );
        // }

        // if (playbackStatus.didJustFinish) {
        //   if (this.state.isPlayListRunning) {
        //     let audio;
        //     const indexOnPlayList = this.state.activePlayList.audios.findIndex(
        //       ({ id }) => id === this.state.currentAudio.id
        //     );
        //     const nextIndex = indexOnPlayList + 1;
        //     audio = this.state.activePlayList.audios[nextIndex];

        //     if (!audio) audio = this.state.activePlayList.audios[0];

        //     const indexOnAllList = this.state.audioFiles.findIndex(
        //       ({ id }) => id === audio.id
        //     );

        //     const status = await playNext(this.state.playbackObj, audio.uri);
        //     return this.updateState(this, {
        //       soundObj: status,
        //       isPlaying: true,
        //       currentAudio: audio,
        //       currentAudioIndex: indexOnAllList,
        //     });
        //   }

        //   const nextAudioIndex = this.state.currentAudioIndex + 1;
        //   // there is no next audio to play or the current audio is the last
        //   if (nextAudioIndex >= this.totalAudioCount) {
        //     this.state.playbackObj.unloadAsync();
        //     this.updateState(this, {
        //       soundObj: null,
        //       currentAudio: this.state.audioFiles[0],
        //       isPlaying: false,
        //       currentAudioIndex: 0,
        //       playbackPosition: null,
        //       playbackDuration: null,
        //     });
        //     return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
        //   }
        //   // otherwise we want to select the next audio
        //   const audio = this.state.audioFiles[nextAudioIndex];
        //   const status = await playNext(this.state.playbackObj, audio.uri);
        //   this.updateState(this, {
        //     soundObj: status,
        //     currentAudio: audio,
        //     isPlaying: true,
        //     currentAudioIndex: nextAudioIndex,
        //   });
        //   await storeAudioForNextOpening(audio, nextAudioIndex);
        // }
    };

    const play = async (uri, lastPosition) => {
        try {
            if (!lastPosition)
                return await playbackObj.loadAsync(
                    { uri },
                    { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
                );

            // but if there is lastPosition then we will play audio from the lastPosition
            await playbackObj.loadAsync(
                { uri },
                { progressUpdateIntervalMillis: 1000 }
            );

            return await playbackObj.playFromPositionAsync(lastPosition);
        } catch (error) {
            console.log("error inside play helper method", error.message);
        }
    };

    const pause = async () => {
        try {
            return await playbackObj.setStatusAsync({
                shouldPlay: false,
            });
        } catch (error) {
            console.log("error inside pause helper method", error.message);
        }
    };

    const resume = async () => {
        try {
            return await playbackObj.setStatusAsync({ shouldPlay: true });
        } catch (error) {
            console.log("error inside resume helper method", error.message);
        }
    };

    const playNext = async (uri) => {
        try {
            await playbackObj.stopAsync();
            await playbackObj.unloadAsync();
            return await play(uri);
        } catch (error) {
            console.log("error inside playNext helper method", error.message);
        }
    };

    const selectAudio = async (key) => {
        try {
            let det = audioFiles.find((i) => i.key === key.toString());

            if (soundObj === null) {
                // playing for first time
                const status = await play(det.audioUrl);
                setcurrentAudio(det);
                setcurrentAudioIndex(det.key);
                setsoundObj(status);
                setisPlaying(true);
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }

            if (
                //pause Audio
                soundObj.isLoaded &&
                soundObj.isPlaying &&
                currentAudioIndex === det.key
            ) {
                const status = await pause();
                setsoundObj(status);
                setisPlaying(false);
                setplaybackPosition(status.positionMillis);
            }

            if (
                soundObj.isLoaded &&
                !soundObj.isPlaying &&
                currentAudioIndex === det.key
            ) {
                const status = await resume();
                setsoundObj(status);
                setisPlaying(true);
            }

            if (soundObj.isLoaded && currentAudioIndex !== det.key) {
                //select another file
                const status = await playNext(det.audioUrl);
                console.log("status", status);

                setcurrentAudio(det);
                setcurrentAudioIndex(det.key);
                setsoundObj(status);
                setisPlaying(true);
            }
        } catch (error) {
            console.log("error inside select audio method.", error.message);
        }
    };

    const getFiles = async () => {
        let val = await getPermission();
        if (val.done === true) {
            setplaybackObj(new Audio.Sound());
            setaudioFiles(val.final);
        }
        // setaudioFiles(await getPermission());
    };

    const changeAudio = async (select) => {
        const { isLoaded } = await playbackObj.getStatusAsync();
        const isLastAudio =
            (Number(currentAudioIndex) + 1).toString() === totalAudioCount;
        const isFirstAudio = currentAudioIndex <= 10;

        let audio;
        let index;
        let status;
        try {
            if (select === "next") {
                audio = audioFiles.find(
                    (i) => i.key === (Number(currentAudioIndex) + 1).toString()
                );
                if (!isLoaded && !isLastAudio) {
                    index = (Number(currentAudioIndex) + 1).toString();
                    status = await play(audio.audioUrl);
                    playbackObj.setOnPlaybackStatusUpdate(
                        onPlaybackStatusUpdate
                    );
                }

                if (isLoaded && !isLastAudio) {
                    index = (Number(currentAudioIndex) + 1).toString();
                    status = await playNext(audio.audioUrl);
                }

                if (isLastAudio) {
                    index = 0;
                    audio = audioFiles[index];
                    if (isLoaded) {
                        status = await playNext(playbackObj, audio.audioUrl);
                    } else {
                        status = await play(playbackObj, audio.audioUrl);
                    }
                }
            }
            if (select === "prev") {
                audio = audioFiles.find(
                    (i) => i.key === (Number(currentAudioIndex) - 1).toString()
                );

                if (!isLoaded && !isFirstAudio) {
                    index = currentAudioIndex - 1;
                    status = await play(audio.audioUrl);
                    playbackObj.setOnPlaybackStatusUpdate(
                        onPlaybackStatusUpdate
                    );
                }

                if (isLoaded && !isFirstAudio) {
                    index = currentAudioIndex - 1;
                    status = await playNext(audio.audioUrl);
                }

                if (isFirstAudio) {
                    index = totalAudioCount - 1;
                    audio = audioFiles[index];
                    if (isLoaded) {
                        status = await playNext(audio.audioUrl);
                    } else {
                        status = await play(audio.audioUrl);
                    }
                }
            }
            // write code for prev and next song
            setcurrentAudio(audio);
            setsoundObj(status);
            setisPlaying(true);
            setcurrentAudioIndex(index);
            setplaybackPosition(null);
            setplaybackDuration(null);
        } catch (error) {
            console.log("error inside change audio method.", error.message);
        }
    };

    const moveAudio = async (value) => {
        if (soundObj === null || !isPlaying) return;

        try {
            const status = await playbackObj.setPositionAsync(
                Math.floor(soundObj.durationMillis * value)
            );
            setsoundObj(status);
            setplaybackPosition(status.positionMillis);

            await resume();
        } catch (error) {
            console.log("error inside onSlidingComplete callback", error);
        }
    };

    useEffect(() => {
        settotalAudioCount(audioFiles.length);
    }, [audioFiles]);

    return (
        <AudioContext.Provider
            value={{
                audioFiles,
                playList,
                addToPlayList,
                playbackObj,
                soundObj,
                currentAudio,
                isPlaying,
                currentAudioIndex,
                // totalAudioCount: this.totalAudioCount,
                playbackPosition,
                playbackDuration,
                isPlayListRunning,
                activePlayList,
                toggleisPlaying,
                selectAudio,
                changeAudio,
                pause,
                moveAudio,
                onPlaybackStatusUpdate,
                // updateState: this.updateState,
                // loadPreviousAudio: this.loadPreviousAudio,
                // onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export default AudioProvider;
