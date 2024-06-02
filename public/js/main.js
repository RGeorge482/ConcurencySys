const gameMessages = document.querySelector(".game-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const gameGrid = document.querySelector(".game-grid");
for (let i = 0; i < 100; i++) {
  const gridItem = document.createElement("div");
  gridItem.id = "dropzoneA";
  gridItem.className = "interact dropzone";
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


// Grag and drop implemenation
function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = "translate(" + x + "px, " + y + "px)";
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function onDragEnter(event) {
  var draggableElement = event.relatedTarget;
  var dropzoneElement = event.target;
  dropzoneElement.classList.add("drop-target");
  draggableElement.classList.add("can-drop");
}

function onDragLeave(event) {
  event.target.classList.remove("drop-target");
  event.relatedTarget.classList.remove("can-drop");
}

function onDrop(event) {
  event.target.classList.remove("drop-target");
}

document.addEventListener("DOMContentLoaded", (event) => {
  window.dragMoveListener = dragMoveListener;

  interact("#dropzoneA").dropzone({
    accept: ".itemA",
    overlap: 0.75,
    ondragenter: onDragEnter,
    ondragleave: onDragLeave,
    ondrop: onDrop,
  });

  interact(".draggable").draggable({
    inertia: true,
    autoScroll: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    listeners: {
      move: dragMoveListener,
    },
  });
});