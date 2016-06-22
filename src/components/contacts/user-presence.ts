import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { select, NgRedux } from 'ng2-redux';

import { IAppState } from '../../reducers';
import { Contacts } from '../../reducers/contacts';
import { Presence } from '../../contacts';

@Component({
  selector: 'rio-user-presence',
  template: `
    <select [(ngModel)]="state" (ngModelChange)="onStateChanged($event)">
      <option [value]="presence.Online">Online</option>
      <option [value]="presence.Offline">Offline</option>
      <option [value]="presence.Idle">Idle</option>
    </select>
  `
})
export class RioUserPresence {
  @Output() private stateChange = new EventEmitter<Presence>();

  private presence = Presence;

  private state: Presence;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.state = this.ngRedux.getState().contacts.get('presence');
  }

  private onStateChanged(state: Presence) {
    this.stateChange.emit(state);
  }
}
