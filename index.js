const GameInstance = require('./lib/GameInstance')
// index.js provides standard entry point
module.exports = () => {
  // singleton GameInstance maintains state and is removed from memory on exit
  new GameInstance()
}