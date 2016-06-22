'use strict';

module.exports = (app, io) => {
  io.on('connection', () => {
    console.log('connected');
  });
};
