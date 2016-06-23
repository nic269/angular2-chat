import {
  List,
  Map,
  fromJS
} from 'immutable';
import { NgRedux } from 'ng2-redux';

import { IAppState } from '../reducers';

import {
  ConversationActions,
  MessageSource,
} from '../actions/conversation';

import {
  Contact,
  Presence,
} from '../contacts';

import { SessionActions } from '../actions/session';

const INITIAL_STATE = fromJS({
  participant: null,
});

export type Conversation = Map<string, any>;

export const getContact =
    (state: Conversation, appState: IAppState, key: string, from: string) => {
  const contacts: List<Contact> = appState.contacts.get(key);
  return contacts.find(k => k.get('username') === from);
};

const conversationReducer = (state: Conversation = INITIAL_STATE, action) => {
  switch (action.type) {
  case ConversationActions.OPEN_CONVERSATION:
    return state.set('participant', fromJS(action.payload));

  case ConversationActions.CLOSE_CONVERSATION:
    return state.delete('participant');

  case ConversationActions.SEND_MESSAGE:
    const {message} = action.payload;

    const m = { source: MessageSource.Local, message };

    return state.setIn(['participant', 'messages'],
      state.get('participant').get('messages').concat([m]));

  case ConversationActions.RECEIVE_MESSAGE:
    const {appState, from} = action.payload;

    let participant = state.get('participant');
    if (!participant || participant.get('username') !== from) {
      participant = getContact(state, appState, 'people', from)
                 || getContact(state, appState, 'availablePeople', from)
                 || fromJS({
                      username: from,
                      messages: [],
                      presence: Presence.Online,
                    });
      state = state.set('participant', participant);
    }

    const username = participant.get('username');
    if (from === username) {
      const m = {
        source: MessageSource.Remote,
        message: action.payload.text
      };

      return state.setIn(['participant', 'messages'],
        state.get('participant').get('messages').concat([m]));
    }
    return state;

  case SessionActions.LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
};

export { conversationReducer };
