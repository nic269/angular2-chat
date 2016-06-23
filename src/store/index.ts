import { Map, fromJS } from 'immutable';

import logger from './configure-logger';

const persistState = require('redux-localstorage');

const persist = k => persistState(k, {
  key: `angular2-chat-${k}`,
  serialize: store => {
    if (store == null) {
      return null;
    }
    return JSON.stringify(store[k].toJS());
  },
  deserialize: state => {
    if (state == null) {
      return null;
    }
    const parsed = JSON.parse(state);
    if (parsed == null) {
      return null;
    }
    return { [k]: state ? fromJS(parsed) : fromJS({}) };
  }
});

const keys = [
  'contacts',
  'conversation',
  'session',
];

export const enhancers = keys.map(k => persist(k));

export const middleware = [];

declare const __DEV__: boolean; // from webpack
if (__DEV__) {
  middleware.push(logger);

  const environment: any = window || this;
  if (environment.devToolsExtension) {
    enhancers.push(environment.devToolsExtension());
  }
}
