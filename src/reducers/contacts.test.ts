import { Map } from 'immutable';

import fireAction from '../utils/fire-action';

import { contactsReducer } from './contacts';
import { ContactsActions } from '../actions/contacts';

let state = contactsReducer();

describe('contacts reducer', () => {
  describe('inital state', () => {
    it('should be a Map', () => {
      expect(Map.isMap(state)).toBe(true);
    });
  });

  // describe('on INCREMENT_COUNTER', () => {
  //   it('should increment state.count', () => {
  //     const previousValue = state.get('count');
  //     state = fireAction(
  //       contactsReducer,
  //       state,
  //       ContactsActions.INCREMENT_COUNTER);
  //     expect(state.get('count')).toEqual(1);
  //   });
  // });
});
