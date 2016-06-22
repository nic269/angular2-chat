import * as assert from 'assert';
import fireAction from '../utils/fire-action';
import { sessionReducer } from '../reducers/session';
import { SessionActions } from '../actions/session';

import { Map } from 'immutable';

let state = sessionReducer();

describe('Session Reducer', () => {
  describe('inital state', () => {
    it('should be a Map', () => {
      expect(Map.isMap(state)).toBe(true);
    });
  });

  describe('on LOGIN_USER_PENDING', () => {
    it('should set loading to true', () => {
      state = fireAction(
        sessionReducer,
        state,
        SessionActions.LOGIN_USER_PENDING);
      expect(state.get('pending')).toBeTruthy;
      expect(state.get('token')).toEqual(null);
    });
  });

  describe('on LOGIN_USER_SUCCESS', () => {
    it('should save the user token', () => {
      state = fireAction(
        sessionReducer,
        state,
        SessionActions.LOGIN_USER_SUCCESS,
        { token: 1234 });

      expect(state.get('pending')).toBeFalsy;
      expect(state.get('failure')).toBeFalsy;
      expect(state.get('token')).toEqual(1234);
    });
  });

  describe('on LOGIN_USER_ERROR', () => {
    it('should save the username', () => {
      state = fireAction(
        sessionReducer,
        state,
        SessionActions.LOGIN_USER_ERROR);

      expect(state.get('pending')).toBeFalsy;
      expect(state.get('failure')).toBeTruthy;
    });
  });


  describe('on LOGOUT_USER', () => {
    it('should save the username', () => {
      state = fireAction(
        sessionReducer,
        state,
        SessionActions.LOGOUT_USER);

      expect(state.get('pending')).toBeTruthy;
      expect(state.get('failure')).toBeFalsy;
      expect(state.get('token')).toEqual(null);
    });
  });
});
