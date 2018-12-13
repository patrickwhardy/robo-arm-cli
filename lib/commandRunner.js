const executeCommand = (move, args, slots) => {
  switch(move) {
    case 'start':
      console.log('start')
      break
    case 'add':
      console.log('add');
      break
    case 'mv':
      console.log('mv');
      break
    case 'rm':
      console.log('rm');
      break
    case 'replay':
      console.log('replay');
      break
    case 'undo':
      console.log('undo');
      break
    default:
      console.log(`${move} is not valid. Please enter one of the following: size [n], add [slot], mv [slot1] [slot2], rm [slot], replay [n], undo [n]`)
  }
  return slots
}

module.exports = executeCommand