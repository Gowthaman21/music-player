import * as MediaLibrary from "expo-media-library";
import MusicInfo from "expo-music-info";

const readProp = async (url) => {
    let data = await MusicInfo.getMusicInfoAsync(url, {
        title: true,
        artist: true,
        album: true,
        genre: true,
        picture: true,
    });

    return data;
};

function fmtMSS(s) {
    let m = (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
    m = m.substring(0, m.indexOf("."));
    return m;
}

const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: media.totalCount,
    });

    let auFiles = [];
    media.assets.map((i) => {
        if (i.duration > 200 && i.filename.endsWith(".mp3")) {
            let temp = {
                id: i.id,
                uri: i.uri,
                duration: i.duration,
                filename: i.filename,
            };
            auFiles.push(temp);
            // console.log("url", temp.filename);
        }
    });
    return auFiles;
};

export const getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
        let dum = await getAudioFiles();
        let dum2 = [];
        const requests = dum.map(async (i) => dum2.push(await readProp(i.uri)));
        await Promise.all(requests).then(() => {
            dum2.map((i) => {
                // console.log("log", i.album);
            });
        });
        let final = [];
        if (dum.length === dum2.length) {
            for (var i = 0; i < dum.length; i++) {
                let d1 = dum[i];
                let d2 = dum2[i]; //make default values
                if (d2 === null) {
                    d2 = {
                        title: d1.filename,
                        album: "unknown album",
                        artist: "unknown",
                        picture: {
                            pictureData:
                                "https://st.depositphotos.com/3538103/5169/i/950/depositphotos_51692599-stock-photo-music-icon-design.jpg",
                        },
                    };
                }
                let g = d2?.picture?.pictureData;
                if (!g) {
                    d2.picture = {
                        pictureData:
                            "https://st.depositphotos.com/3538103/5169/i/950/depositphotos_51692599-stock-photo-music-icon-design.jpg",
                    };
                }

                let temp = {
                    key: (i + 10).toString(),
                    title: d2.title,
                    audioUrl: d1.uri,
                    artist: d2.artist,
                    album: d2.album,
                    duration: fmtMSS(d1.duration),
                    albumArtUrl: d2?.picture?.pictureData,
                };
                // console.log("temp", temp.artist);

                final.push(temp);
            }
        }

        return { final: final, done: true };
    }
    if (!permission.canAskAgain && !permission.granted) {
        return false;
    }
    if (!permission.granted && permission.canAskAgain) {
        const { status, canAskAgain } =
            await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            return true;
        }
    }
};
