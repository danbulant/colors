import { exec, readUTF, writeUTF } from "./utils.js";
import * as fs from "fs";

interface IJoyStick {
    name: string;
    led: string;
    dev: string;
}

interface Colors {
    red: number;
    green: number;
    blue: number;
}

export class JoyStick implements IJoyStick {
    name: string;
    led: string;
    dev: string;

    constructor(data: IJoyStick) {
        this.name = data.name;
        this.led = data.led;
        this.dev = data.dev;
    }

    async getColors() {
        const [ red, green, blue ] = (await Promise.all([
            readUTF(`/sys/class/leds/${this.led}:red/brightness`),
            readUTF(`/sys/class/leds/${this.led}:green/brightness`),
            readUTF(`/sys/class/leds/${this.led}:blue/brightness`),
        ])).map(t => parseInt(t));

        return { red, green, blue } as Colors;
    }

    async setColors(colors: Colors) {
        await Promise.all([
            writeUTF(`/sys/class/leds/${this.led}:red/brightness`, colors.red.toString()),
            writeUTF(`/sys/class/leds/${this.led}:green/brightness`, colors.green.toString()),
            writeUTF(`/sys/class/leds/${this.led}:blue/brightness`, colors.blue.toString()),
        ]);
    }

    private _maxColors?: Colors;
    async getMaxColors() {
        if(!this._maxColors) {
            const [ red, green, blue ] = (await Promise.all([
                readUTF(`/sys/class/leds/${this.led}:red/max_brightness`),
                readUTF(`/sys/class/leds/${this.led}:green/max_brightness`),
                readUTF(`/sys/class/leds/${this.led}:blue/max_brightness`),
            ])).map(t => parseInt(t));
            this._maxColors = { red, green, blue };
        }

        return this._maxColors;
    }

    private static async getDevice(name: string) {
        const out = await exec(["udevadm", "info", "-n", name]);
        const data: Record<string, string> = {};
        for(const line of out.split("\n")) {
            if(line[0] !== "E") continue;
            const [, key, val] = line.match(/^E: ([A-Z_]+)=(.*)$/)!;
            data[key] = val;
        }
        return new JoyStick({
            name: data.ID_SERIAL,
            led: data.DEVPATH.split("/")[8],
            dev: data.DEVNAME
        });
    }

    static async getList() {
        const devices = await Promise.all([
            ...fs.readdirSync("/dev/input")
        ].filter(t => t.startsWith("js"))
            .map(t => this.getDevice(`/dev/input/${t}`)));
        return devices;
    }
}