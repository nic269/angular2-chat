'use strict';

module.exports = (app, io) => {
  const onConnect = (socket) => {
    socket.on('message', (payload) => {
      socket.broadcast.emit('message', payload);
    });
    socket.on('presence', (payload) => {
      socket.broadcast.emit('presence', payload);
    })
  };

  io.on('connection', onConnect);
};
