## robo-arm-cli is a simple command line tool that moves blocks into slots.

This project requires node v10.14.2, npm and a unix shell to be installed.

To install, cd into root of the project and run the following:

```
$ npm link
```

The program can now be run from anywhere with the following:

```
$ robo-arm
```

#### The tool was designed in accordance with the following coding challenge:
Design a command-line program that controls a robotic arm by taking commands that move blocks stacked in a series of slots. After each command, output the state of the slots, with each line of output corresponding to a slot and each X corresponding to a block.

Commands:

size [n] - Adjusts the number of slots, resizing if necessary. Program must start with this to be valid.
add [slot] - Adds a block to the specified slot.
mv [slot1] [slot2] - Moves a block from slot1 to slot2.
rm [slot] - Removes a block from the slot.
replay [n] - Replays the last n commands.
undo [n] - Undo the last n commands.
Your program should validate that the commands are syntactically valid before executing them.
