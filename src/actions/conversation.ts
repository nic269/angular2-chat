import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { IAppState } from '../reducers';

import {
  Contact,
  ConcreteContact,
  MessageSource,
  Message
} from '../contacts';

import { RealTime } from '../services/server';

export {
  MessageSource,
  Message
};

@Injectable()
export class ConversationActions {
  static OPEN_CONVERSATION = 'OPEN_CONVERSATION';
  static CLOSE_CONVERSATION = 'CLOSE_CONVERSATION';
  static SEND_MESSAGE = 'SEND_MESSAGE';
  static RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

  unsubscribe: Function = () => {};

  constructor(private ngRedux: NgRedux<IAppState>,
              private realTime: RealTime) {
    this.unsubscribe = this.realTime.subscribe(this.receive.bind(this));
  }

  open(contact: ConcreteContact) {
    this.ngRedux.dispatch({
      type: ConversationActions.OPEN_CONVERSATION,
      payload: contact
    });
  }

  send(contact: Contact, message: string) {
    this.realTime.sendMessage(contact.get('username'), message);
    this.ngRedux.dispatch({
      type: ConversationActions.SEND_MESSAGE,
      payload: {
        source: MessageSource.Local,
        contact,
        message
      }
    });
  }

  receive(payload) {
    const state = this.ngRedux.getState();

    const target = payload.username;

    const me = state.session
      .get('user')
      .get('username');

    if (target !== me) {
      console.log('Ignoring message not destined for me');
      return;
    }

    this.ngRedux.dispatch({
      type: ConversationActions.RECEIVE_MESSAGE,
      payload: Object.assign({}, payload, {appState: state})
    });
  }

  close() {
    this.ngRedux.dispatch({ type: ConversationActions.CLOSE_CONVERSATION });
  }
}
