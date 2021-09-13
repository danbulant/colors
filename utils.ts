import { promises as afs } from "fs";
import { spawn } from "child_process";
import got from "got";
import Vibrant from 'node-vibrant';

export async function readUTF(file: string) {
    return await afs.readFile(file, { encoding: "utf-8" }) as string;
}
export async function writeUTF(file: string, data: string) {
    await afs.writeFile(file, data);
}

export function exec(cmd: string[]) {
    return new Promise<string>((resolve, reject) => {
        var output = "";
        var error = "";
        const p = spawn(cmd.shift(), cmd);
        p.stdout.on("data", (chunk) => output += chunk);
        p.stderr.on("data", (chunk) => error += chunk);

        p.on("exit", (code) => {
            if(code) return reject(error);
            resolve(output);
        });
    });
}

export async function getCurrentUser() {
    return "dan";
}

export async function getColor(image: string) {
    var resp = await got(image, {
        responseType: "buffer"
    });
    var vibrant = new Vibrant(resp.body);
    var color = await vibrant.getPalette();
    return color;
}

export function lerp(a: number, b: number, u: number) {
    return (1 - u) * a + u * b;
};