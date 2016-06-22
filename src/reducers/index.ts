import { combineReducers } from 'redux';
import {
  Contacts,
  contactsReducer,
} from './contacts';
import {
  Conversation,
  conversationReducer,
} from './conversation';
import {
  Session,
  sessionReducer,
} from './session';

export interface IAppState {
  contacts?: Contacts;
  conversation?: Conversation;
  session?: Session;
};

export const rootReducer = combineReducers<IAppState>({
  contacts: contactsReducer,
  conversation: conversationReducer,
  session: sessionReducer
});
