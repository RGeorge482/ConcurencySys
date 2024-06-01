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

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  gameMessages.scrollTop = gameMessages.scrollHeight;
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector(".game-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    const won = user.won || 0;
    const lost = user.lost || 0;
    li.innerHTML = `${user.username} - Won: ${won} Lost: ${lost}`;
    userList.appendChild(li);
  });
}
