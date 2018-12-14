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
          slots[i + 1] = ''
        }
        return slots
      }
    },
    add: {
      argCount: 1,
      validate: (args, slots) => {},
      execute: (args, slots, executedCommands) => {
        return slots
      }
    },
    mv: {
      argCount: 2,
      validate: (args, slots, executedCommands) => {},
      execute: (args, slots, executedCommands) => {
        return slots
      }
    },
    rm: {
      argCount: 1,
      validate: (args, slots, executedCommands) => {},
      execute: (args, slots, executedCommands) => {
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
