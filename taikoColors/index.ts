import { JoyStick } from "../joystick.js";
import struct from "python-struct";

const devices = await JoyStick.getList();
enum map {
    x = 0,
    circle,
    triangle,
    square,
    L1,
    R1,
    L2,
    R2,
    share,
    options,
    ps,
    L3,
    R3
}
enum EventTypes {
    button = 1,
    axis = 2
}

for(const device of devices) {
    device.setColors({
        red: 0,
        green: 0,
        blue: 0
    });
    let pressed = new Set<number>();
    device.createEventStream().on("data", (buf) => {
        const data = struct.unpack("LhBB", buf);
        if(data[2] !== EventTypes.button) return;
        if(data[1] === 1) {
            pressed.add(Number(data[3]));
            console.log("Pressed", data[3]);
        } else {
            pressed.delete(Number(data[3]));
            console.log("Unpressed", data[3]);
        }

        device.setColors({
            red: (pressed.has(map.R1) || pressed.has(map.R2)) ? 255 : 0,
            green: 0,
            blue: (pressed.has(map.L1) || pressed.has(map.L2)) ? 255 : 0
        });
    });
}