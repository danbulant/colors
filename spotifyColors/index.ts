import { JoyStick } from "../joystick.js";
import spotify from "./spotify.js";
import { getColor, lerp } from "../utils.js";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type Palette = ThenArg<ReturnType<typeof getColor>>;

const devices = await JoyStick.getList();
var color: Palette, lastURL: string, lastColor: Palette["DarkMuted"];

const perColor = 1000;

setInterval(async () => {
    const track = await spotify.getCurrentTrack();
    if(lastURL !== track.artURL) {
        console.log("Track:", track.artist, "-", track.title);
        color = await getColor(track.artURL);
        lastURL = track.artURL;
    }

    function transitionColors(startColor: Palette["DarkMuted"], endColor: Palette["DarkMuted"]) {
        return new Promise<void>((resolve) => {
            const start = Date.now();
            var i = setInterval(async() => {
                if(start + perColor < Date.now()) {
                    resolve();
                    return clearInterval(i);
                }
                const progress = (Date.now() - start) / perColor;
                
                const newColors = {
                    red: Math.round(lerp(startColor.r, endColor.r, progress)),
                    green: Math.round(lerp(startColor.g, endColor.g, progress)),
                    blue: Math.round(lerp(startColor.b, endColor.b, progress)),
                };
                
                for(const device of devices) {
                    await device.setColors(newColors);
                }
            }, 10);
        });
    }

    await transitionColors(lastColor || color.LightMuted, color.LightVibrant);
    await transitionColors(color.LightVibrant, color.Vibrant);
    await transitionColors(color.Vibrant, color.DarkVibrant);
    lastColor = color.DarkVibrant;
}, perColor * 3);