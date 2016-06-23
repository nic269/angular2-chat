import { List, Map, fromJS } from 'immutable';

import { AddContactState, Contact } from '../contacts';
import { ContactsActions } from '../actions/contacts';
import { SessionActions } from '../actions/session';
import { Presence } from '../contacts';
import {
  ConversationActions,
  MessageSource,
} from '../actions/conversation';

const INITIAL_STATE = fromJS({
  add: {
    modal: false,
    state: AddContactState.Idle,
    failure: null
  },

  // people added to your contacts,
  people: [],

  // the universe of available people
  availablePeople: [],

  // our presence
  presence: Presence.Online,
});

export type Contacts = Map<string, any>;

const updateAvailableContact =
  (state: Contacts, index: number, key: string, value) => {
    const people: List<Contact> = state.get('availablePeople');

    return state.set('availablePeople',
      people.update(index, v => v.set(key, value)));
  };

const updateAllAvailableContacts =
  (state: Contacts, key: string, value) => {
    const people: List<Contact> = state.get('availablePeople');

    return state.set('availablePeople',
      people.withMutations(l => {
        for (let i = 0; i < l.count(); ++i) {
          l.update(i, v => v.set(key, value));
        }
      }));
  };

const addMessage = (state: Contacts, username: string,
    source: MessageSource, message: string) => {
  const people: List<Contact> = state.get('people');

  const m = { source, message };

  return state.set('people',
    people.withMutations(p => {
      const index = p.findIndex(c => c.get('username') === username);
      p.update(index, v => v.mergeDeep(fromJS({ messages: [m] })));
    }));
};

const def = {type: '', payload: null};

const contactsReducer = (state: Contacts = INITIAL_STATE, action = def) => {
  switch (action.type) {
  case ContactsActions.CHANGE_PRESENCE:
    return state.set('presence', action.payload);

  case ContactsActions.SELECT_CONTACT:
    const {index: sindex} = action.payload;
    return updateAvailableContact(state, sindex, 'selected', true);

  case ContactsActions.UNSELECT_CONTACT:
    const {index: uindex} = action.payload;
    return updateAvailableContact(state, uindex, 'selected', false);

  case ContactsActions.ADD_CONTACT:
    return state.mergeIn(['add'],
      { modal: true, state: AddContactState.Idle, failure: null });

  case ContactsActions.ADD_CONTACT_PENDING:
    return updateAllAvailableContacts(
             state.mergeIn(['add'], {
               state: AddContactState.Adding,
               failure: null,
             })
             .updateIn(['people'],  List(), l => l.concat(action.payload)),
          'selected', false);

  case ContactsActions.ADD_CONTACT_CANCEL:
    return state.mergeIn(['add'], {
      modal: false,
      state: AddContactState.Idle,
    });

  case ContactsActions.ADD_CONTACT_COMPLETE:
    return state.mergeIn(['add'],
      { modal: false, state: AddContactState.Idle });

  case ContactsActions.ADD_CONTACT_ERROR:
    return state.mergeIn(['add'], {
      failure: action.payload,
      state: AddContactState.Failed
    });

  case ContactsActions.REQUEST_AVAILABLE_CONTACTS:
    return state.mergeIn(['add'], {
      state: AddContactState.Loading
    });

  case ContactsActions.LIST_AVAILABLE_CONTACTS_FAILED:
    return state.mergeIn(['add'], {
      state: AddContactState.Failed
    });

  case ContactsActions.LIST_AVAILABLE_CONTACTS:
    return state
            .setIn(['availablePeople'], fromJS(action.payload))
            .mergeIn(['add'], { state: AddContactState.Idle });

  case ConversationActions.SEND_MESSAGE:
    const {source, message, contact} = action.payload;

    const username = contact.get('username');

    return addMessage(state, username, source, message);

  case SessionActions.LOGIN_USER_SUCCESS:
    const {contacts, presence} = action.payload;

    return state
             .set('people', fromJS(contacts || []))
             .set('presence', presence);

  case SessionActions.LOGOUT_USER:
    return state.merge(INITIAL_STATE);

  default:
    return state;
  }
};

export { contactsReducer };
