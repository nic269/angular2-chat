import { Injectable } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { IAppState } from '../reducers';
import { ConcreteContact } from '../contacts';

@Injectable()
export class ConversationActions {
  static OPEN_CONVERSATION = 'OPEN_CONVERSATION';
  static CLOSE_CONVERSATION = 'CLOSE_CONVERSATION';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  open(contact: ConcreteContact) {
    this.ngRedux.dispatch({
      type: ConversationActions.OPEN_CONVERSATION,
      payload: contact
    });
  }

  close() {
    this.ngRedux.dispatch({ type: ConversationActions.CLOSE_CONVERSATION });
  }
}
