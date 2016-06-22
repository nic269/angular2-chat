import {
  ApplicationRef,
  Component,
  Inject
} from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { bindActionCreators } from 'redux';
import { select } from 'ng2-redux';

import { ContactsActions } from '../actions/contacts';
import { Contact } from '../contacts';
import { Contacts } from '../reducers/contacts';
import {
  RioContainer,
  RioContacts
} from '../components';

@Component({
  selector: 'contacts-page',
  providers: [ ContactsActions ],
  directives: [ RioContainer, RioContacts ],
  pipes: [ AsyncPipe ],
  template: `
    <rio-container [size]=2 [center]=true>
      <h2 id="qa-contacts-heading" class="center caps">
        Contacts
      </h2>
      <rio-contacts
        (add)="actions.show()"
        (cancel)="actions.cancel()"
        (request)="actions.add()"
        (select)="actions.select($event)"
        (unselect)="actions.unselect($event)"
        (changePresence)="actions.changePresence($event)">
      </rio-contacts>
    </rio-container>
  `
})
export class RioContactsPage {
  constructor(private actions: ContactsActions) {}
}
