const GameInstance = require('./lib/GameInstance')

module.exports = () => {
  // GameInstance removed from memory on exit
  new GameInstance()
}