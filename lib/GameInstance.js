const readline = require('readline');
const moves = require('./moves')
const { dialogue } = require('./constants')

class GameInstance {
  constructor() {
    this.executedCommands = []
    this.slots = {}
    this.gameStarted = false

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.promptUser(dialogue.START)

    // set up listener
    this.rl.on('line', line => {
      if (!this.gameStarted) {
        this.handleStart(line)
      } else {
        this.handleCommand(line)
      }
    })

    process.on('exit', () => {
      console.log(dialogue.EXIT)
    })
  }

  promptUser(message) {
    console.log(message)
    this.rl.prompt()
  }

  handleStart(cmd) {
    try {
      this.validateStartCommand(cmd)
      this.handleCommand(cmd)
      this.gameStarted = true
    } catch(error) {
      this.promptUser(error.message)
    }
  }

  validateStartCommand(cmd) {
    const [ move ] = cmd.split(' ')

    if (move !== 'size') {
      throw new Error(dialogue.NEED_SIZE)
    }
  }

  handleCommand(cmd) {
    // main recursive game loop
    const [ move, ...args ] = cmd.split(' ')
    const moveProps = moves[move]

    try {
      this.validateCommand(move, args)
      const [ slots, executedCommands ] = moveProps.execute(args, this.slots, this.executedCommands)
      // only redo and undo have track and return executedCommands
      if (executedCommands) {
        this.executedCommands = executedCommands
      } else {
        this.executedCommands.push(cmd)  
      }

      this.slots = slots
      this.renderSlots()
      this.promptUser(dialogue.NEXT_MOVE)

    } catch(error) {
      this.promptUser(error.message)
    }
  }

  validateCommand(move, args) {
    const moveProps = moves[move]

    // handle generic validation in GameInstance
    if (!moveProps) {
      throw new Error(`${move} ${dialogue.INVALID_COMMAND}`)
    } else if (moveProps.argCount !== args.length) {
      throw new Error(`${move} requires ${moves[move].argCount} arguments \n`)
    } else if (!this.arePositiveNumbers(args)) {
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
    console.log(formattedSlots.join('\n'))
  }
  
  arePositiveNumbers(args) {
    let arePositive = true
    args.forEach(arg => {
      const number = parseInt(arg, 16)
      if (isNaN(number) || number < 0) {
        arePositive = false
      }
    })
    return arePositive
  }
}

module.exports = GameInstance
