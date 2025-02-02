const { Server } = require("socket.io");

const games = {};

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-game", (gameId, user, ships) => {
      if (!games[gameId]) {
        games[gameId] = { players: {}, hits: {}, ships: {}, currentTurn: null };
      }

      games[gameId].players[user] = { socketId: socket.id };
      games[gameId].ships[user] = ships;

      console.log(`${user} joined game ${gameId}`);

      if (Object.keys(games[gameId].players).length === 2) {
        const players = Object.keys(games[gameId].players);
        const [player1, player2] = players;

        games[gameId].currentTurn = player1;

        const player1Ships = games[gameId].ships[player1];
        const player2Ships = games[gameId].ships[player2];

        io.to(games[gameId].players[player1].socketId).emit(
          "start-game",
          player2Ships
        );
        io.to(games[gameId].players[player2].socketId).emit(
          "start-game",
          player1Ships
        );

        io.to(games[gameId].players[player1].socketId).emit("your-turn");
      }
    });

    socket.on("hit", (gameId, user, coordinate) => {
      if (!games[gameId]) {
        console.error(`Game ${gameId} does not exist.`);
        return;
      }

      const opponent = Object.keys(games[gameId].players).find(
        (player) => player !== user
      );

      if (!opponent) {
        console.error(`Opponent not found for game ${gameId}.`);
        return;
      }

      const opponentShips = games[gameId].ships[opponent];

      console.log("test", coordinate);

      if (opponentShips.includes(coordinate)) {
        if (!games[gameId].hits[user]) {
          games[gameId].hits[user] = [];
        }

        games[gameId].hits[user].push(coordinate);

        const allShipsDestroyed = opponentShips.every((shipCoord) =>
          games[gameId].hits[user].includes(shipCoord)
        );

        if (allShipsDestroyed) {
          console.log(`Game ${gameId} is over! ${user} wins!`);
          io.to(games[gameId].players[user].socketId).emit("game-over", "win");
          io.to(games[gameId].players[opponent].socketId).emit(
            "game-over",
            "lose"
          );

          delete games[gameId];
          return;
        }

        games[gameId].currentTurn = opponent;
        io.to(games[gameId].players[opponent].socketId).emit("your-turn");
      } else {
        console.log(
          `${user} missed at ${coordinate}. Now it's ${opponent}'s turn!`
        );
        games[gameId].currentTurn = opponent;
        io.to(games[gameId].players[opponent].socketId).emit("your-turn");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
