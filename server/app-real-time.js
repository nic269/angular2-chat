'use strict';

module.exports = (app, io) => {
  io.on('connection', (socket) => {
    console.log('Client Connected');
    socket.on('message', (payload) => {
      console.log('Message Received: ', payload);
      socket.broadcast.emit('message', payload);
    });
  });
};
