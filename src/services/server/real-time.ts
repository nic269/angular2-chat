import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { NgRedux } from 'ng2-redux';

import { IAppState } from '../../reducers/index';
import {
  ConcreteContact,
  Presence
} from '../../contacts';

declare const __PRODUCTION__: boolean;
const BACKEND_PORT = 3000;

@Injectable()
export class RealTime {
  private socket;

  constructor(private ngRedux: NgRedux<IAppState>) {
    this.socket = __PRODUCTION__
      ? io()
      : io(`http://localhost:${BACKEND_PORT}`);
  }

  private get self(): string {
    return this.ngRedux.getState().session.get('user').get('username');
  }

  sendMessage(username: string, text: string) {
    this.socket.emit('message', {
      from: this.self,
      username,
      text,
    });
  }

  subscribeMessage(callback: Function) {
    this.socket.on('message', callback);

    return () => this.socket.removeListener('message', callback);
  }

  publishPresence(state: Presence) {
    this.socket.emit('presence', {
      from: this.self,
      state
    });
  }

  subscribePresence(
      callback: (from: ConcreteContact, presence: Presence) => void) {
    this.socket.on('presence', m => callback(m.from, m.state));

    return () => this.socket.removeListener('message', callback);
  }
}
