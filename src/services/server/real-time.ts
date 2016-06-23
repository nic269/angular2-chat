import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../../reducers/index';

declare const __PRODUCTION__: boolean;
const BACKEND_PORT = 3000;

@Injectable()
export class RealTime {
  socket;

  constructor(private ngRedux: NgRedux<IAppState>) {

    if (__PRODUCTION__) {
      console.log('Real time engine in production mode');
      this.socket = io();
    } else {
      console.log('Real time engine in dev mode');
      this.socket = io(`http://localhost:${BACKEND_PORT}`);
    }
  }

  sendMessage(username: string, text: string) {
    const from = this.ngRedux.getState().session.get('user').get('username');
    this.socket.emit('message', {
      from,
      username,
      text,
    });
  }

  subscribe(callback: Function) {
    this.socket.on('message', callback);

    return () => {
      this.socket.removeListener('message', callback);
    };
  }
}
