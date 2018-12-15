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

      if (desiredSlotCount > currentCount) {
        for (let i = 0; i < desiredSlotCount; i++) {
          if (!slots[i + 1]) {
            slots[i + 1] = ' '
          }
        }
      } else if (desiredSlotCount < currentCount) {
        for (let i = currentCount; i > desiredSlotCount; i--) {
          // blocks in deleted slots are not saved
          delete slots[i.toString()]
        }
      }
      return [ slots ]
    },
    undo: (args, slots, executedCommands) => {
      const lastSizeCommand = executedCommands.slice().reverse().find(cmd => cmd.includes('size'));
      lastSize = lastSizeCommand.split(' ')[1]
      return executeMove('size', lastSize, slots)
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
    },
    undo: (args, slots) => {
      return executeMove('rm', args, slots)
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
    },
    undo: (args, slots) => {
      // flip direction of mv
      return executeMove('mv', [args[1], args[0]], slots)
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
    },
    undo: (args, slots) => {
      return executeMove('add', args, slots)
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
    },
    // the replay command is not part of history
    undo: () => {}
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
        slots = handleUndo(undoMove, undoArgs, slots, executedCommands)
      }
      return [ slots, executedCommands ]
    },
    // the undo command is not part of history
    undo: () => {}
  }
}

// undo/redo does not update slots if any move fails validation.
// Several valid series of moves cannot undone. e.g. 'size 3, add 3, size 2, undo 2'.
// In this case, slot 3 will be empty when undo executes rm 3
// since slot 3's state was not saved when size was changed to 2
const executeMove = (move, args, slots) => {
  const moveProps = moves[move]
  moveProps.validate(args, slots)
  const [ nextSlots ] = moveProps.execute(args, slots)
  return nextSlots
}

const handleUndo = (move, args, slots, executedCommands) => {
  return moves[move].undo(args, slots, executedCommands)
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
