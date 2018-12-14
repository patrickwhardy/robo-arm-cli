const { dialogue, reverseMoves } = require('./constants')

// moves is an extensible object to make GamerInstance generic, moves stateless and adding moves to the CLI simple
const moves = {
  size: {
    argCount: 1,
    validate: () => {},
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
      // assuming you can't delete the slots altogether
      if (executedCommands.length - 1 < args[0]) {
        throw new Error(dialogue.CANT_UNDO)
      }
    },
    execute: (args, slots, executedCommands) => {
      for (let i = 0; i < args[0]; i++) {
        // undone commands are removed from history
        let [ undoMove, ...undoArgs ] = executedCommands.pop().split(' ')
        const nextMove = reverseMoves[undoMove]
        if (nextMove === 'mv') {
          // mv will throw an error if slot was emptied on last mv
          undoArgs = [undoArgs[1], undoArgs[0]]
        } else if (nextMove === 'size') {
          const lastSizeCommand = executedCommands.slice().reverse().find(cmd => cmd.includes('size'));
          undoArgs = lastSizeCommand.split(' ')[1]
        }
        slots = executeMove(nextMove, undoArgs, slots)
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

// undo/redo does not update slots if any move fails validation
// some edgecases will cause an error. i.e. 'size 3, add 3, size 2, undo 2'
// in this case, slot 3 will be empty when undo executes rm 3
function executeMove(move, args, slots) {
  const moveProps = moves[move]
  moveProps.validate(args, slots)
  const [ nextSlots ] = moveProps.execute(args, slots)
  return nextSlots
}

module.exports = moves
