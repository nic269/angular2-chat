import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { IAppState } from '../reducers';
import {
  ConcreteContact,
  MessageSource,
  Message
} from '../contacts';

export {
  MessageSource,
  Message
};

@Injectable()
export class ConversationActions {
  static OPEN_CONVERSATION = 'OPEN_CONVERSATION';
  static CLOSE_CONVERSATION = 'CLOSE_CONVERSATION';
  static SEND_MESSAGE = 'SEND_MESSAGE';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  open(contact: ConcreteContact) {
    this.ngRedux.dispatch({
      type: ConversationActions.OPEN_CONVERSATION,
      payload: contact
    });
  }

  send(contact: ConcreteContact, message: string) {
    this.ngRedux.dispatch({
      type: ConversationActions.SEND_MESSAGE,
      payload: {
        source: MessageSource.Local,
        contact,
        message
      }
    });
  }

  close() {
    this.ngRedux.dispatch({ type: ConversationActions.CLOSE_CONVERSATION });
  }
}
