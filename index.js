const GameInstance = require('./lib/GameInstance')

module.exports = () => {
  // singleton GameInstance maintains state and is removed from memory on exit
  new GameInstance()
}