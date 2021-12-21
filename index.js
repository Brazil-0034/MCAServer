// debug mode
const debug = false;

const ip = require("ip");
const express = require('express');
const app = express();
app.use(require("cors")());
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

let players = [];

io.on('connection', (socket) => {
  // event
  console.log("Players: " + players);
  io.to(socket.id).emit("loadJoinedPlayersEvent", players)

  // message from client
  socket.on("message", data => {
      console.log(data);
  });

  socket.on("clientConnectionEvent", (playerID) => {
    console.log("New Player Joined with ID " + playerID);
    socket.broadcast.emit("playerJoinEvent", playerID);
    players.push(playerID);
  });

  socket.on("clientBlockPlaceEvent", (x, y, z) => {
    if (debug === true) console.log("Block placed at " + x + ", " + y + ", " + z);
    socket.broadcast.emit("blockPlacedEvent", x, y, z);
  });

  socket.on("clientMoveEvent", (playerID, x, y, z) => {
    if (debug === true) console.log("Player " + playerID + " moved to " + x + ", " + y + ", " + z);
    socket.broadcast.emit("playerMoveEvent", playerID, x, y, z);
  });
});

server.listen(3000, function() {
	console.log('Server listening at port %d', 3000);
});

console.log("Server started at " + ip.address());