const readline = require('readline');
const moves = require('./moves')
const { dialogue } = require('./dialogue')

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
    // main recursive game loop
    const [ move, ...args ] = cmd.split(' ')
    const moveProps = moves[move]

    try {
      this.validateCommand(move, args)
      const [ slots, executedCommands ] = moveProps.execute(args, this.slots, this.executedCommands)
      // only redo and undo have to track executedCommands
      if (executedCommands) {
        this.executedCommands = executedCommands
      } else {
        this.executedCommands.push(cmd)  
      }

      this.slots = slots
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

    // handle generic validation in GameInstance
    if (!moveProps) {
      throw new Error(`${move} ${dialogue.INVALID_COMMAND}`)
    } else if (moveProps.argCount !== args.length) {
      throw new Error(`${move} requires ${moves[move].argCount} arguments \n`)
    } else if (!this.areNumbers(args)) {
      throw new Error(dialogue.ARGS_ARE_NUMBERS)
    }
    // handle move-specific validation in move object
    moveProps.validate(args, this.slots, this.executedCommands)
  }
  
  renderSlots() {
    let formattedSlots = [];
    for (var index in this.slots) {
        formattedSlots.push(`${index}: ${this.slots[index]}`);
    }
    console.log(formattedSlots.join("\n"))
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
