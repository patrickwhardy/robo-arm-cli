const dialogue = {
    INVALID_COMMAND: `is not a valid move. Please enter one of the following: \n
      size [n] - Adjusts the number of slots, resizing if necessary. Program must start with this to be valid.\n
      add [slot] - Adds a block to the specified slot.\n
      mv [slot1] [slot2] - Moves a block from slot1 to slot2.\n
      rm [slot] - Removes a block from the slot.\n
      replay [n] - Replays the last n commands.\n
      undo [n] - Undo the last n commands.`,
    START: `Welcome to robo-arm. Use the following commands to create, remove and move blocks and slots.
      size [n] - Adjusts the number of slots, resizing if necessary. Program must start with this to be valid.\n
      add [slot] - Adds a block to the specified slot.\n
      mv [slot1] [slot2] - Moves a block from slot1 to slot2.\n
      rm [slot] - Removes a block from the slot.\n
      replay [n] - Replays the last n commands.\n
      undo [n] - Undo the last n commands.`,
    EXIT: 'Exiting robo-arm. Thanks for playing.',
    NEED_SIZE: 'Your first command must be size [n].',
    NEXT_MOVE: 'What would you like to do next?',
    ARGS_ARE_NUMBERS: 'Arguments must be positive numbers.',
    ADD_EXISTING_ROW: 'Blocks must be added to an existing row.',
    REMOVE_EXISTING_ROW: 'Blocks must be removed from an existing row with blocks.',
    MOVE_FROM_POPULATED: 'You can only move an existing block into another row.',
    CANT_REPLAY: 'You can not replay more moves than you have executed.',
    CANT_UNDO: 'You can not undo more moves than you have executed.'
}

module.exports = dialogue