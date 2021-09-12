import { promises as afs } from "fs";
import { spawn } from "child_process";
import got from "got";
import Vibrant from 'node-vibrant';

export async function readUTF(file: string) {
    return await afs.readFile(file, { encoding: "utf-8" }) as string;
}
export async function writeUTF(file: string, data: string) {
    return await afs.writeFile(file, data);
}

export function exec(cmd: string[]) {
    return new Promise<string>((resolve, reject) => {
        var output = "";
        const p = spawn(cmd.shift(), cmd);
        p.stdout.on("data", (chunk) => output += chunk);
        p.on("exit", (code) => {
            if(code) return reject(code);
            resolve(output);
        });
    });
}

export async function getColor(image: string) {
    var resp = await got(image, {
        responseType: "buffer"
    });
    var vibrant = new Vibrant(resp.body);
    var color = await vibrant.getPalette();
}