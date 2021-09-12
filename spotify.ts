import { exec } from "./utils";

interface Track {
    length: number;
    artURL: string;
    id: string;
    url: string;
    artist: string;
    album: string;
    albumArtist: string;
}

class Spotify {
    async getCurrentTrack() {
        const data: Record<string, string> = {};
        const out = await exec(["qdbus", "org.mpris.MediaPlayer2.spotify", "/org/mpris/MediaPlayer2", "org.mpris.MediaPlayer2.Player.Metadata"]);

    }
}

export default new Spotify();