import { JoyStick } from "./joystick";

const devices = await JoyStick.getList();

for(const device of devices) {
    const colors = await device.getColors();
    const max = await device.getMaxColors();
    console.log(`Found device ${device.name}:
    Colors:
        RED ${colors.red}
        GREEN ${colors.green}
        BLUE ${colors.blue}
    Max colors:
        RED ${max.red}
        GREEN ${max.green}
        BLUE ${max.blue}`)
    const newColors = {
        red: Math.floor(Math.random() * max.red),
        green: Math.floor(Math.random() * max.green),
        blue: Math.floor(Math.random() * max.blue),
    };
    await device.setColors(newColors);
    console.log(`
    Updated colors:
        RED ${newColors.red}
        GREEN ${newColors.green}
        BLUE ${newColors.blue}`);
}