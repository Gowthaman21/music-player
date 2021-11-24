import * as MediaLibrary from "expo-media-library";
import MusicInfo from "expo-music-info";

const readProp = async (i) => {
    let data = await MusicInfo.getMusicInfoAsync(i.uri, {
        title: true,
        artist: true,
        album: true,
        genre: true,
        picture: true,
    });

    let det = { ...i, ...data };

    return det;
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
        const requests = dum.map(async (i) => dum2.push(await readProp(i)));
        await Promise.all(requests).then(() => {
            dum2.map((i) => {
                // console.log("log", i.album);
            });
        });
        let final = [];
        for (var i = 0; i < dum2.length; i++) {
            let d2 = dum2[i]; //make default values
            if (!d2.title) {
                d2.title = d2.filename;
            }
            if (!d2.album) {
                d2.album = "unknown album";
            }
            if (!d2.artist) {
                d2.artist = "unknown";
            }
            let g = d2?.picture?.pictureData;
            if (!g || g === "data:image/jpeg;base64,") {
                d2.picture = {
                    pictureData:
                        "https://st.depositphotos.com/3538103/5169/i/950/depositphotos_51692599-stock-photo-music-icon-design.jpg",
                };
            }

            let temp = {
                key: (i + 10).toString(),
                title: d2.title,
                audioUrl: d2.uri,
                artist: d2.artist,
                album: d2.album,
                duration: fmtMSS(d2.duration),
                albumArtUrl: d2?.picture?.pictureData,
            };
            final.push(temp);
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
