const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 5000;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const lodash = require('lodash');

const GameManager = require('./GameManager');
const Player = require('./Player');

// middleware, debug and serve client dir
app.use(morgan('dev'));
app.use(express.static(__dirname + '/client/build'));

/*
 * GameManager instance
 */
const gameManager = new GameManager(io);

/*
 * Client Connection
 */
io.on('connection', function (socket) {
  let userID;

  /*
   * New Player
   */
  socket.on('new player', function (id, name) {
    userID = new Player(id, name);
    gameManager.players.push(userID);
    socket.emit('userID', userID);
    io.emit('players', gameManager.players);
  });

  /*
   * Player Disconnects
   */
  socket.on('disconnect', function (reason) {
    console.log('user disconnected', reason);
    gameManager.players = gameManager.players.filter(function (obj) {
      return obj !== userID;
    });
    io.emit('players', gameManager.players);
  });

  /*
   * Player Roll
   */
  socket.on('roll', function () {
    userID.roll = lodash.random(1, 1000);

    gameManager.nextRoundCheck();
  });

  io.emit('players', gameManager.players);
});

/*
 * Start server
 */
http.listen(port, function () {
  console.log(`ready http://localhost:${port}`);
});
