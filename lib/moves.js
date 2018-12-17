const dialogue = require('./dialogue')

// moves is an extensible object designed to make GamerInstance generic.
// This allows moves to be stateless and makes adding moves to the game simple.
const moves = {
  size: {
    argCount: 1,
    // size has no move-specific validation
    validate: () => {},
    execute: (args, slots) => {
      const desiredSlotCount = args[0]
      const currentCount = Object.keys(slots).length
      // add empty slots if making bigger
      if (desiredSlotCount > currentCount) {
        for (let i = 0; i < desiredSlotCount; i++) {
          if (!slots[i + 1]) {
            slots[i + 1] = ' '
          }
        }
      // delete if making smaller (blocks aren't saved)
      } else if (desiredSlotCount < currentCount) {
        for (let i = currentCount; i > desiredSlotCount; i--) {
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
      const beginningIndex = executedCommands.length - args[0]
      const replayCommands = executedCommands.slice(beginningIndex, executedCommands.length)

      // commands execute in the same order they were entered
      replayCommands.forEach(cmd => {
        const [ move, ...moveArgs ] = cmd.split(' ')
        slots = executeMove(move, moveArgs, slots)
      })

      // commands executed in 'replay' are added to history
      return [ slots, executedCommands.concat(replayCommands) ]
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
      // using 'event sourcing' approach to replay n number of commands from an initial state
      const replayCount = executedCommands.length - args[0]
      slots = {}
      executedCommands = executedCommands.slice(0, replayCount)

      executedCommands.forEach(cmd => {
        const [ move, ...moveArgs ] = cmd.split(' ')
        slots = executeMove(move, moveArgs, slots)
      })

      return [ slots, executedCommands ]
    }
  }
}

// undo/redo does not update slots if any move fails validation.
// some valid moves cannot be replayed on current state:
// e.g. size 1, add 1, rm 1, replay 1
const executeMove = (move, args, slots) => {
  const moveProps = moves[move]
  moveProps.validate(args, slots)
  const [ nextSlots ] = moveProps.execute(args, slots)
  return nextSlots
}

const slotIsPopulated = (slots, index) => {
  return slots[index].includes('X')
}

const removeBlock = (slots, index) => {
  slots[index] = slots[index].replace('X','')
  return slots
}

const addBlock = (slots, index) => {
  slots[index] = `${slots[index]}X`
  return slots
}

module.exports = moves
