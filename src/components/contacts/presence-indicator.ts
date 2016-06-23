import {
  Component,
  Input
} from '@angular/core';

import { Presence } from '../../contacts';

@Component({
  selector: 'rio-presence-indicator',
  template: `
    <div class="presence" [ngClass]="{
      'idle': presence == presenceStates.Idle,
      'online': presence == presenceStates.Online,
      'offline': presence == presenceStates.Offline}">
    </div>`,
  styles: [require('./presence-indicator.css')],
})
export class RioPresenceIndicator {
  private presenceStates = Presence;

  @Input() private presence: Presence;
}
