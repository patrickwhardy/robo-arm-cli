module.exports = {
  dialogue: {
    START: 'Welcome to robo-arm. Please designate how many slots you want with the following: start [n] \n',
    EXIT: 'Exiting robo-arm. Thanks for playing.',
    INVALID_COMMAND: `is not valid. Please enter one of the following: size [n], add [slot], mv [slot1] [slot2], rm [slot], replay [n], undo [n] \n`,
    NEED_START: 'Your first command must be start [n] \n',
    NEXT_MOVE: 'What would you like to do next? \n'
  },
  moves: {
    start: 'start',
    add: 'add',
    mv: 'mv',
    rm: 'rm',
    replay: 'replay',
    undo: 'undo'
  }
}