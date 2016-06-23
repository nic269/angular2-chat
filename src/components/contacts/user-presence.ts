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

import { RioPresenceIndicator } from './presence-indicator';

@Component({
  selector: 'rio-user-presence',
  template: `
    <div>
      <select [(ngModel)]="state" (ngModelChange)="onStateChanged($event)">
        <option [value]="presence.Online">Online</option>
        <option [value]="presence.Offline">Offline</option>
        <option [value]="presence.Idle">Idle</option>
      </select>
      <rio-presence-indicator [presence]="state">
      </rio-presence-indicator>
    </div>
  `,
  directives: [ RioPresenceIndicator ]
})
export class RioUserPresence {
  @Output() private stateChange = new EventEmitter<Presence>();

  private presence = Presence;

  private state: Presence;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  private update() {
    const p = presence => {
      switch (typeof presence) {
      default:
        return Presence.Online;
      case 'number':
        return presence;
      case 'string':
        const n = parseInt(presence, 10);
        if (isNaN(n)) {
          return Presence[presence];
        }
        return n;
      }
    };

    this.state = p(this.ngRedux.getState().contacts.get('presence'));
  }

  private ngOnInit() {
    this.update();
  }

  private ngOnChanges() {
    this.update();
  }

  private onStateChanged(state: Presence) {
    this.stateChange.emit(state);
  }
}
