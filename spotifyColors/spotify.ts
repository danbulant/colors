import { exec, getCurrentUser } from "../utils.js";

interface Track {
    length: number;
    title: string;
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
        const out = await exec(["machinectl", "shell", "--uid=" + await getCurrentUser(), ".host", "/usr/bin/qdbus", "org.mpris.MediaPlayer2.spotify", "/org/mpris/MediaPlayer2", "org.mpris.MediaPlayer2.Player.Metadata"]);
        for(const line of out.split("\n")) {
            const key = line.substr(0, line.indexOf(" ")).trim();
            if(!key) continue;
            const value = line.substr(line.indexOf(" ") + 1).trim();
            data[key] = value;
        }
        return {
            length: Number(data["mpris:length:"]),
            title: data["xesam:title:"],
            artURL: data["mpris:artUrl:"],
            id: data["mpris:trackid:"],
            url: data["xesam:url:"],
            artist: data["xesam:artist:"],
            album: data["xesam:album:"],
            albumArtist: data["xesam:albumArtist:"]
        } as Track;
    }
}

export default new Spotify();