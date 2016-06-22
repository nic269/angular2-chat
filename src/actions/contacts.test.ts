import { NgRedux } from 'ng2-redux';
import {
  beforeEach,
  describe,
  expect,
  it,
} from '@angular/core/testing';

import { ContactsActions } from './contacts';

class MockRedux extends NgRedux<any> {
  constructor() {
    super(null);
  }
  dispatch: () => {};
}

describe('contacts action creators', () => {
  let actions: ContactsActions;
  let mockRedux: NgRedux<any>;

  beforeEach(() => {
    mockRedux = new MockRedux();
    actions = new ContactsActions(mockRedux, null);
  });

  // it('decrement should dispatch DECREMENT_COUNTER action', () => {
  //   const expectedAction = {
  //     type: ContactsActions.DECREMENT_COUNTER
  //   };

  //   spyOn(mockRedux, 'dispatch');
  //   actions.decrement();

  //   expect(mockRedux.dispatch).toHaveBeenCalled();
  //   expect(mockRedux.dispatch).toHaveBeenCalledWith(expectedAction);
  // });
});
