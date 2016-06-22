import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../reducers';
import { ServerService } from '../services/server';

import {
  Contact,
  ConcreteContact,
  Presence,
} from '../contacts';

export interface SelectEvent {
  // The contact being selected or unselected
  contact: ConcreteContact;

  // The index of the contact inside the available contacts list
  index: number;
};

@Injectable()
export class ContactsActions {
  static SELECT_CONTACT = 'SELECT_CONTACT';
  static UNSELECT_CONTACT = 'UNSELECT_CONTACT';
  static ADD_CONTACT = 'ADD_CONTACT';
  static ADD_CONTACT_CANCEL = 'ADD_CONTACT_CANCEL';
  static ADD_CONTACT_COMPLETE = 'ADD_CONTACT_COMPLETE';
  static ADD_CONTACT_PENDING = 'ADD_CONTACT_PENDING';
  static ADD_CONTACT_ERROR = 'ADD_CONTACT_ERROR';
  static CHANGE_PRESENCE = 'CHANGE_PRESENCE';
  static REQUEST_AVAILABLE_CONTACTS = 'REQUEST_AVAILABLE_CONTACTS';
  static LIST_AVAILABLE_CONTACTS = 'LIST_AVAILABLE_CONTACTS';
  static LIST_AVAILABLE_CONTACTS_FAILED = 'LIST_AVAILABLE_CONTACTS_FAILED';

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private service: ServerService) {}

  show() {
    this.ngRedux.dispatch({ type: ContactsActions.ADD_CONTACT });

    this.list();
  }

  cancel() {
    this.ngRedux.dispatch({ type: ContactsActions.ADD_CONTACT_CANCEL });
  }

  select(event: SelectEvent) {
    this.ngRedux.dispatch({
      type: ContactsActions.SELECT_CONTACT,
      payload: event
    });
  }

  unselect(event: SelectEvent) {
    this.ngRedux.dispatch({
      type: ContactsActions.UNSELECT_CONTACT,
      payload: event
    });
  }

  add() {
    const state = this.ngRedux.getState();

    const existing = state.contacts.get('people').toJS();

    const selected = state.contacts.get('availablePeople')
      .filter(
        p => p.get('selected') &&
        existing.find(c => c.username === p.username) == null);

    if (selected.count() === 0) {
      return;
    }

    this.ngRedux.dispatch({
      type: ContactsActions.ADD_CONTACT_PENDING,
      payload: selected,
    });

    const body = selected.toJS();

    const promise = this.service.postSingle<void>('/contacts/add', body);

    return promise.then(
      () => this.ngRedux.dispatch({
        type: ContactsActions.ADD_CONTACT_COMPLETE,
      }),
      err => this.ngRedux.dispatch({
        type: ContactsActions.ADD_CONTACT_ERROR,
        payload: err.message || 'Failure to add contact'
      }));
  }

  list() {
    this.ngRedux.dispatch({ type: ContactsActions.REQUEST_AVAILABLE_CONTACTS });

    const promise = this.service.getSingle<ConcreteContact[]>('/contacts/list');

    const transform = (c: ConcreteContact) => {
      return Object.assign({}, c, { presence: Presence[c.presence] });
    };

    return promise.then(
      contacts => this.ngRedux.dispatch({
        type: ContactsActions.LIST_AVAILABLE_CONTACTS,
        payload: contacts.map(c => transform(c)),
      }),
      err => this.ngRedux.dispatch({
        type: ContactsActions.LIST_AVAILABLE_CONTACTS_FAILED,
      }));
  }

  changePresence(state: Presence) {
    const promise = this.service
      .getSingle<void>(`/contacts/change-presence/${Presence[state]}`);

    promise.then(() => {});

    this.ngRedux.dispatch({
      type: ContactsActions.CHANGE_PRESENCE,
      payload: state,
    });
  }
}
