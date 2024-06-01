//server.js
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { Worker } = require("worker_threads");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const gmName = "Game";

// Worker to handle game logic
const worker = new Worker(path.join(__dirname, 'worker.js'));


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));