import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  AsyncPipe,
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Control,
  Validators
} from '@angular/common';

import { fromJS } from 'immutable';

import { Observable } from 'rxjs';

import {
  RioForm,
  RioFormError,
  RioFormGroup,
  RioLabel,
} from '../form';
import { RioAlert } from '../alert';
import { RioButton } from '../button';
import { RioInput } from '../form/input';
import { RioSearchableList } from './searchable-list';
import { SelectEvent } from '../../actions/contacts';
import {
  AddContactState,
  ConcreteContact,
  Presence,
} from '../../contacts';
import { validateEmail } from '../form/validators';

@Component({
  selector: 'rio-add-contact-form',
  directives: [
    FORM_DIRECTIVES,
    RioAlert,
    RioButton,
    RioInput,
    RioForm,
    RioFormError,
    RioFormGroup,
    RioLabel,
    RioSearchableList,
  ],
  template: `
    <rio-form [formModel]="group" (submit)="onAdd()">
      <div [ngSwitch]="state">
        <rio-alert *ngSwitchWhen="addContactState.Failed" status="error">
          Request failed
        </rio-alert>
        <rio-alert *ngSwitchWhen="addContactState.Loading" status="info">
          Loading contacts&hellip;
        </rio-alert>
        <rio-alert *ngSwitchWhen="addContactState.Adding" status="info">
          Adding contact&hellip;
        </rio-alert>
      </div>

      <rio-searchable-list
        [list]="availablePeople"
        (select)="onSelect($event)"
        (unselect)="onUnselect($event)">
      </rio-searchable-list>

      <rio-form-group>
        <rio-button
          qaid="qa-add-button"
          [disabled]="selectedCount === 0"
          className="btn btn-primary mr1"
          type="submit">
          Add to Contacts
        </rio-button>
        <rio-button
          qaid="qa-cancel-button"
          className="btn bg-red"
          (onClick)="onCancel()">
          Cancel
        </rio-button>
      </rio-form-group>
    </rio-form>
  `,
  pipes: [ AsyncPipe ]
})
export class RioAddContactForm {
  @Input() state: AddContactState;

  @Input() availablePeople: ConcreteContact[];

  // Cancel and hide the modal
  @Output() cancel = new EventEmitter<void>();

  // Add all availablePeople marked selected to the contacts list
  @Output() add = new EventEmitter<void>();

  // Called when a contact is selected in the list
  @Output() select = new EventEmitter<SelectEvent>();

  // Called when a contact is selected in the list
  @Output() unselect = new EventEmitter<SelectEvent>();

  private selectedCount = 0;

  private addContactState = AddContactState;

  private search: Control;

  private group: ControlGroup;

  constructor(private builder: FormBuilder) {
    this.search = new Control(null);

    this.group = this.builder.group({});
  }

  private onAdd = () => {
    this.add.emit(void 0);
  }

  private onCancel = () => {
    this.cancel.emit(void 0);
  }

  private onSelect = (event: SelectEvent) => {
    this.select.emit(event);

    this.selectedCount++;
  }

  private onUnselect = (event: SelectEvent) => {
    this.unselect.emit(event);

    this.selectedCount--;
  }
};
