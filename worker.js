const { parentPort } = require('worker_threads');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// Multithreading implementation
parentPort.on('message', (data) => {
  const { type, payload } = data;

  switch(type) {
    case 'userJoin':
      const user = userJoin(payload.id, payload.username, payload.room);
      parentPort.postMessage({ type: 'userJoined', payload: user });
      break;
    case 'getCurrentUser':
      const currentUser = getCurrentUser(payload.id);
      parentPort.postMessage({ type: 'currentUser', payload: currentUser });
      break;
    case 'userLeave':
      const leftUser = userLeave(payload.id);
      parentPort.postMessage({ type: 'userLeft', payload: leftUser });
      break;
    case 'getRoomUsers':
      const roomUsers = getRoomUsers(payload.room);
      parentPort.postMessage({ type: 'roomUsers', payload: roomUsers });
      break;
    default:
      break;
  }
});