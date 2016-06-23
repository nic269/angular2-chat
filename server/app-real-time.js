'use strict';

module.exports = (app, io, users) => {
  const onConnect = (socket) => {
    console.log('Client Connected');
    socket.on('message', (payload) => {
      console.log('received payload', payload);
      socket.broadcast.emit('message', payload);
    });
  };

  io.on('connection', onConnect);
};
