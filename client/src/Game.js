import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Game.css';
const socket = io();

function Game() {
  const [gameActive, setGameActive] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({});
  const [playersTurn, setPlayersTurn] = useState(0);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('Welcome to the Game 👾');

  const listPlayers = (players) => {
    console.log('listPlayers', players);
    setPlayers(players);
  };

  useEffect(() => {
    socket.on('players', listPlayers);
    socket.on('inplay', (data) => setMessage(data));
    socket.on('playersTurn', (data) => setPlayersTurn(data));
    socket.on('userID', (data) => setPlayerInfo(data));
  }, []);

  useEffect(() => {
    checkTurn();
  }, [players]);

  const handleJoinGameFormSubmit = (event) => {
    event.preventDefault();
    const user = event.target.user;

    let id = 'player_' + Math.floor(Date.now() * Math.random());

    socket.emit('new player', id, user.value);

    setMessage(`Welcome ${user.value} 👋`);
    setGameActive(true);
  };

  const handleRollClick = (event) => {
    console.log(`roll`);
    socket.emit('roll');
  };

  const checkTurn = () => {
    // console.log('checkTurn', players);
    players.forEach((player) => {
      if (
        player.id &&
        players[playersTurn] &&
        player.id === players[playersTurn].id
      ) {
        console.log('is players turn', players[playersTurn].id);
        console.log(playersTurn);
      }
    });
  };

  return (
    <div className="App">
      <h1>Game</h1>
      <p>{message}</p>

      {!gameActive ? (
        <form onSubmit={handleJoinGameFormSubmit}>
          <input name="user" type="text" placeholder="username" />
          <button>Join</button>
        </form>
      ) : (
        <div>
          {players[playersTurn] &&
            players[playersTurn].id === playerInfo.id && (
              <button onClick={handleRollClick}>Roll</button>
            )}
        </div>
      )}
      <p>Players turn: {players[playersTurn] && players[playersTurn].name}</p>
      <h3>Current players</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} {!player.roll ? 'waiting' : `roll: ${player.roll}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Game;
