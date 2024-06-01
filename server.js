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
