import { Map, fromJS } from 'immutable';

import { ConversationActions } from '../actions/conversation';
import { SessionActions } from '../actions/session';

const INITIAL_STATE = fromJS({
  participant: null,
});

export type Conversation = Map<string, any>;

const conversationReducer = (state: Conversation = INITIAL_STATE, action) => {
  switch (action.type) {
  case ConversationActions.OPEN_CONVERSATION:
    return state.set('participant', fromJS(action.payload));

  case ConversationActions.CLOSE_CONVERSATION:
    return state.delete('participant');

  case SessionActions.LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
};

export { conversationReducer };
