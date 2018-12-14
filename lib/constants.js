module.exports = {
  dialogue: {
    START: 'Welcome to robo-arm. Please designate how many slots you want with the following: size [n].',
    EXIT: 'Exiting robo-arm. Thanks for playing.',
    INVALID_COMMAND: `is not a valid move. Please enter one of the following: size [n], add [slot], mv [slot1] [slot2], rm [slot], replay [n], undo [n].`,
    NEED_SIZE: 'Your first command must be size [n].',
    NEXT_MOVE: 'What would you like to do next?',
    ARGS_ARE_NUMBERS: 'Arguments must be positive numbers.',
    ADD_EXISTING_ROW: 'Blocks must be added to an existing row.',
    REMOVE_EXISTING_ROW: 'Blocks must be removed from an existing row with blocks.',
    MOVE_FROM_POPULATED: 'You can only move an existing block into another row.',
    CANT_REPLAY: 'You can not replay more moves than you have executed.',
    CANT_UNDO: 'You can not undo more moves than you have executed.'
  },
  reverseMoves: {
    size: 'size',
    add: 'rm',
    mv: 'mv',
    rm: 'add'
  }
}