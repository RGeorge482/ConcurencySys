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
const worker = new Worker(path.join(__dirname, "worker.js"));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    worker.postMessage({
      type: "userJoin",
      payload: { id: socket.id, username, room },
    });

    worker.once("message", (data) => {
      if (data.type === "userJoined") {
        const user = data.payload;
        socket.join(user.room);

        socket.emit(
          "message",
          formatMessage(gmName, "Welcome to Monster Mayhem Game!")
        );

        socket.broadcast
          .to(user.room)
          .emit(
            "message",
            formatMessage(gmName, `${user.username} has joined the game`)
          );

        // Request room users from worker
        worker.postMessage({
          type: "getRoomUsers",
          payload: { room: user.room },
        });

        worker.once("message", (data) => {
          if (data.type === "roomUsers") {
            io.to(user.room).emit("roomUsers", {
              room: user.room,
              users: data.payload,
            });
          }
        });
      }
    });
  });

  socket.on("gameMessage", (msg) => {
    worker.postMessage({ type: "getCurrentUser", payload: { id: socket.id } });

    worker.once("message", (data) => {
      if (data.type === "currentUser") {
        const user = data.payload;
        io.to(user.room).emit("message", formatMessage(user.username, msg));
      }
    });
  });

  socket.on("disconnect", () => {
    worker.postMessage({ type: "userLeave", payload: { id: socket.id } });

    worker.once("message", (data) => {
      if (data.type === "userLeft") {
        const user = data.payload;

        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage(gmName, `${user.username} has left the game`)
          );

          // Request room users from worker
          worker.postMessage({
            type: "getRoomUsers",
            payload: { room: user.room },
          });

          worker.once("message", (data) => {
            if (data.type === "roomUsers") {
              io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: data.payload,
              });
            }
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
