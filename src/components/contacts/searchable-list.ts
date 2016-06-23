import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Control } from '@angular/common';

import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs';
import { List } from 'immutable';

import { IAppState } from '../../reducers';
import { RioInput } from '../form/input';
import { FilteredPipe } from './filtered.pipe';
import { RioPresenceIndicator } from './presence-indicator';
import { Contacts } from '../../reducers/contacts';
import { SelectEvent } from '../../actions/contacts';
import {
  Contact,
  ConcreteContact
} from '../../contacts';

@Component({
  selector: 'rio-searchable-list',
  template: require('./searchable-list.tmpl.html'),
  styles: [require('./searchable-list.css')],
  directives: [
    RioInput,
    RioPresenceIndicator,
  ],
  pipes: [FilteredPipe]
})
export class RioSearchableList {
  @select() private contacts$: Observable<Contacts>;

  @select() private existingContacts: ConcreteContact[];

  @Input() private list: ConcreteContact[];

  @Output() private select = new EventEmitter<SelectEvent>();

  @Output() private unselect = new EventEmitter<SelectEvent>();

  private pipe = new FilteredPipe();

  private filteredList: ConcreteContact[] = [];

  private search: string;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  private filter() {
    const existingContacts = this.ngRedux.getState()
      .contacts.get('people').toJS();

    this.filteredList = this.pipe.transform(
      this.list,
      existingContacts,
      this.search || '');
  }

  private ngOnChanges() {
    this.filter();
  }

  private onSearchChanged() {
    this.filter();
  }

  private onToggleSelect(contact) {
    const event: SelectEvent = {
      contact,
      index: this.list.findIndex(c => c.username === contact.username),
    };

    if (contact.selected) {
      this.unselect.emit(event);
    } else {
      this.select.emit(event);
    }
  }
}
