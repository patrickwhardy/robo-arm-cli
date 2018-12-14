const readline = require('readline');
const { dialogue } = require('./dialogue')
const { moves } = require('./moves')

class GameInstance {
  constructor() {
    this.executedCommands = []

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.rl.question(dialogue.START, (cmd) => {
      this.handleStart(cmd)
    })

    process.on('exit', () => {
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
    const moveProps = moves[move]

    try {
      this.validateCommand(move, args)
      this.slots = moveProps.execute(args, this.slots, this.executedCommands)
      this.executedCommands.push(cmd)
      this.renderSlots()
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
    const moveProps = moves[move]
    if (!moveProps) {
      throw new Error(`${move} ${dialogue.INVALID_COMMAND}`)
    } else if (moveProps.argCount !== args.length) {
      throw new Error(`${move} requires ${moves[move].argCount} arguments \n`)
    } else if (!this.areNumbers(args)) {
      throw new Error(dialogue.ARGS_ARE_NUMBERS)
    }
    moveProps.validate(args, this.slots, this.executedCommands)

    // TODO:
    // validate remove/add to row that doesn't exist
    // validate remove from row that didn't have blocks
    // can't run start after game starts
    // can't undo more moves than have been executed
  }
  
  renderSlots() {
    let strArray = [];
    for (var prop in this.slots) {
        strArray.push(prop + ":\t" + this.slots[prop]);
    }
    console.log(strArray.join("\n"))
  }
  
  areNumbers(args) {
    args.forEach(arg => {
      if(isNaN(parseInt(arg, 16))) {
        return false
      }
    })
    return true
  }
}

module.exports = GameInstance
