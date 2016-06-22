import { List, Map, fromJS } from 'immutable';

import { AddContactState, Contact } from '../contacts';
import { ContactsActions } from '../actions/contacts';
import { SessionActions } from '../actions/session';

const INITIAL_STATE = fromJS({
  add: {
    modal: false,
    state: AddContactState.Idle,
    failure: null
  },
  people: [], // people added to your contacts,
  availablePeople: [] // the universe of available people
});

export type Contacts = Map<string, any>;

const updateAvailableContact =
  (state: Contacts, index: number, key: string, value) => {
    const people: List<Contact> = state.get('availablePeople');

    return state.set('availablePeople',
      people.update(index, v => v.set(key,value)));
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

export function contactsReducer(state: Contacts = INITIAL_STATE, action) {
  switch (action.type) {
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
    return state.mergeIn(['add'], {
      state: AddContactState.Adding,
      failure: null,
    });
  case ContactsActions.ADD_CONTACT_CANCEL:
    return state.mergeIn(['add'], {
      modal: false,
      state: AddContactState.Idle,
    });
  case ContactsActions.ADD_CONTACT_COMPLETE:
    return updateAllAvailableContacts(
             state
                .mergeIn(['add'], { modal: false, state: AddContactState.Idle })
                .updateIn(['people'],  List(), l => l.concat(action.payload)),
            'selected', false);
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
  case SessionActions.LOGOUT_USER:
    return state.merge(INITIAL_STATE);
  default:
    return state;
  }
};
