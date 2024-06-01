const gameMessages = document.querySelector(".game-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const gameGrid = document.querySelector(".game-grid");
for (let i = 0; i < 100; i++) {
  const gridItem = document.createElement("div");
  gameGrid.appendChild(gridItem);
}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join gameroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});