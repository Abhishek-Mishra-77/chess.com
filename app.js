const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", function (uniquesocket) {
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("PlayerRole", "w");
  } else if (!players.black) {
    players.white = uniquesocket.id;
    uniquesocket.emit("PlayerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }

  uniquesocket.on("disconnect", function () {
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }
  });

  uniquesocket.on("move", function (move) {});
});

server.listen(3000, function () {
  console.log("Listening on 3000 port");
});
