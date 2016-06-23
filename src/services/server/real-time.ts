import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

declare const __PRODUCTION__: boolean;
const BACKEND_PORT = 3000;

@Injectable()
export class RealTime {
  socket;

  constructor() {
    
    if (__PRODUCTION__) {
      console.log('Real time engine in production mode');
      this.socket = io();
    } else {
      console.log('Real time engine in dev mode');
      this.socket = io(`http://localhost:${BACKEND_PORT}`);
    }

    console.log('real time engine started');
    
    // delete this and implement send/subscribes
    setInterval(() => {
      console.log('Emitting Test Message');
      this.socket.emit('message', { message: 'TEST' } ); 
    }, 5000);
  }
}
