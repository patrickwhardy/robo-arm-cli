const { dialogue } = require('./dialogue')
// moves is an extensible object to make GamerInstance generic and adding moves simple
module.exports = {
  moves: {
    start: {
      argCount: 1,
      validate: (args, slots, executedCommands) => {
        if (executedCommands.length) {
          throw new Error('start can only be used at the beginning of the game \n')
        }
      },
      execute: (args) => {
        const slotCount = args[0]
        let slots = {}

        for (let i = 0; i < slotCount; i++) {
          slots[i + 1] = ' '
        }
        return slots
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
        return slots
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
        return slots
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
        return slots
      }
    },
    replay: {
      argCount: 1,
      validate: (args, slots, executedCommands) => {},
      execute: (args, slots, executedCommands) => {
        return slots
      }
    },
    undo: {
      argCount: 1,
      validate: (args, slots, executedCommands) => {},
      execute: (args, slots, executedCommands) => {
        return slots
      }
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
  slots[index] = `${slots[index]} X`
  return slots
}
