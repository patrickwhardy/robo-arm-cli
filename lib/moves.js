const { dialogue, reverseMoves } = require('./constants')

// moves is an extensible object to make GamerInstance generic, moves stateless and adding moves to the CLI simple
const moves = {
  size: {
    argCount: 1,
    validate: (args, slots, executedCommands) => {},
    execute: (args, slots) => {
      const slotCount = args[0]
      const currentCount = Object.keys(slots).length

      if (slotCount > currentCount) {
        for (let i = 0; i < slotCount; i++) {
          if (!slots[i + 1]) {
            slots[i + 1] = ' '
          }
        }
      } else if (slotCount < currentCount) {
        for (let i = currentCount; i > slotCount; i--) {
          // blocks in deleted slots are not saved
          delete slots[i.toString()]
        }
      }
      return [ slots ]
    }
  },
  add: {
    argCount: 1,
    validate: (args, slots) => {
      const index = args[0]

      if (!slots[index]) {
        throw new Error(dialogue.ADD_EXISTING_ROW)
      }
    },
    execute: (args, slots) => {
      const index = args[0]
      slots = addBlock(slots, index)
      return [ slots ]
    }
  },
  mv: {
    argCount: 2,
    validate: (args, slots) => {
      const indexFrom = args[0]
      const indexTo = args[1]

      if (!slots[indexFrom] || !slots[indexTo] || !slotIsPopulated(slots, indexFrom)) {
        throw new Error(dialogue.MOVE_FROM_POPULATED)
      }
    },
    execute: (args, slots) => {
      const indexFrom = args[0]
      const indexTo = args[1]

      slots = removeBlock(slots, indexFrom)
      slots = addBlock(slots, indexTo)
      return [ slots ]
    }
  },
  rm: {
    argCount: 1,
    validate: (args, slots) => {
      const index = args[0]

      if (!slots[index] || !slotIsPopulated(slots, index)) {
        throw new Error(dialogue.REMOVE_EXISTING_ROW)
      }
    },
    execute: (args, slots) => {
      const index = args[0]

      slots = removeBlock(slots, index)
      return [ slots ]
    }
  },
  replay: {
    argCount: 1,
    validate: (args, slots, executedCommands) => {
      if (executedCommands.length < args[0]) {
        throw new Error(dialogue.CANT_REPLAY)
      }
    },
    execute: (args, slots, executedCommands) => {
      const commandsReplayed = []

      for (let i = 0; i < args[0]; i++) {
        const nextCommand = executedCommands[executedCommands.length - (i + 1)]
        const [ move, ...moveArgs ] = nextCommand.split(' ')
        slots = executeMove(move, moveArgs, slots)
        commandsReplayed.push(nextCommand)
      }
      // replayed commands are added to history
      return [ slots, executedCommands.concat(commandsReplayed) ]
    }
  },
  undo: {
    argCount: 1,
    validate: (args, slots, executedCommands) => {
      if (executedCommands.length - 1 < args[0]) {
        throw new Error(dialogue.CANT_UNDO)
      }
    },
    execute: (args, slots, executedCommands) => {
      for (let i = 0; i < args[0]; i++) {
        // undone commands are removed from history
        const [ undoMove, ...args ] = executedCommands.pop().split(' ')
        const nextMove = reverseMoves[undoMove]
        if (nextMove === 'mv') {
          slots = executeMove(nextMove, [args[1], args[0]], slots)
        } else {
          slots = executeMove(nextMove, args, slots)
        }
      }
      return [ slots, executedCommands ]
    }
  }
}


function slotIsPopulated(slots, index) {
  return slots[index].includes('X')
}

function removeBlock(slots, index) {
  slots[index] = slots[index].replace('X','')
  return slots
}

function addBlock(slots, index) {
  slots[index] = `${slots[index]}X`
  return slots
}

function executeMove(move, args, slots) {
  const moveProps = moves[move]
  // undo/redo does not update slots if any move fails validation
  // some edgecases will block this such as the following: 'size 3, add 3, size 2, undo 2'
  // since deleted blocks are not saved, slot 3 will be empty when it executes rm 3
  moveProps.validate(args, slots)
  const [ nextSlots ] = moveProps.execute(args, slots)
  return nextSlots
}

module.exports = moves
