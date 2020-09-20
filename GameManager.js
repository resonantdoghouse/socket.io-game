/*
 * GameManager
 */
class GameManager {
  constructor(io) {
    this.players = [];
    this.round = 0;
    this.playersTurn = 0;
    this.io = io;
  }

  nextRoundCheck = () => {
    if (this.players.length > 0) {
      this.playersTurn += 1;
      this.io.emit('playersTurn', this.playersTurn);

      let top = 0;
      let win = 0;

      this.players.forEach((player, index) => {
        player.winner = false;

        // check if top roll
        if (player.roll) {
          if (player.roll && player.roll > top) {
            win = index;
            top = player.roll;
          }
        }
      });

      // set player as winner using array index, defaults to first player?
      this.players[win].winner = true;

      // update players
      this.io.emit('players', this.players);

      // check if all players have gone, if so end round and declare winner of round
      if (this.playersTurn >= this.players.length) {
        this.io.emit(
          'inplay',
          `Round # ${this.round}  winner is ${this.players[win].name}`
        );

        this.round++;
        this.players.forEach((player, index) => {
          player.winner = false;
          player.roll = null;
        });
        this.playersTurn = 0;
        this.io.emit('playersTurn', this.playersTurn);
      }
    }
  };
}

module.exports = GameManager;
