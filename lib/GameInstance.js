const readline = require('readline');
const { dialogue, moves } = require('./constants')
const executeCommand = require('./commandRunner')

class GameInstance {
  constructor() {
    this.slots = {}

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.rl.question(dialogue.START, (cmd) => {
      this.handleStart(cmd)
    })

    process.on('exit', () => {
      // TODO: could intercept and ask if u want to exit
      console.log(dialogue.EXIT)
    })
  }

  handleStart(cmd) {
    try {
      this.validateStartCommand(cmd)
      this.handleCommand(cmd)
    } catch(error) {
      this.rl.question(error.message, (cmd) => {
        this.handleStart(cmd)
      })
    }
  }

  validateStartCommand(cmd) {
    const [ move, ...args ] = cmd.split(' ')

    if (move !== 'start' || args.length !== 1) {
      throw new Error(dialogue.NEED_START)
    }
  }

  handleCommand(cmd) {
    const [ move, ...args ] = cmd.split(' ')

    try {
      this.validateCommand(move, args)
      this.slots = executeCommand(move, args, this.slots)
      console.log(this.slots)
      this.rl.question(dialogue.NEXT_MOVE, (cmd) => {
        this.handleCommand(cmd)
      })
    } catch(error) {
      this.rl.question(error.message, (cmd) => {
        this.handleCommand(cmd)
      })
    }
  }

  validateCommand(move, args) {
    // validate move is one of the set
    if (!moves[move]) {
      throw new Error(`${move} ${dialogue.INVALID_COMMAND}`)
    }
    // TODO:
    // validate number of args
    // validate remove/add to row that doesn't exist
    // validate remove from row that didn't have
  }
}

module.exports = GameInstance
