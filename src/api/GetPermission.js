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
            let temp = { id: i.id, uri: i.uri, duration: i.duration };
            auFiles.push(temp);
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
                console.log("log", i.title);
            });
        });
        let final = [];
        if (dum.length === dum2.length) {
            for (var i = 0; i < dum.length; i++) {
                let d1 = dum[i];
                let d2 = dum2[i];

                let temp = {
                    key: d1.id,
                    title: d2.title,
                    audioUrl: d1.uri,
                    artist: d2.artist,
                    album: d2.album,
                    duration: fmtMSS(d1.duration),
                    albumArtUrl: d2.picture.pictureData,
                };
                final.push(temp);
            }
        }

        return final;
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
