# PS4 controller colors

I had the great idea to programatically set colors of my PS4 controller.

It's not supposed to be easy to setup, but if you need help just contact me. For now, scripts try to find all the connected joy sticks (doesn't filter by type) and set their LEDs (No idea what happens if a joystick doesn't have one), and then sets colors on them.

Project highly depends on linux (uses sys class to control the LEDs) and requires root (non-root operations are setuid'd internally).

## Spotify colors

Uses DBUS which needs your username. For now just edit the utils function getUsername to return your username.
