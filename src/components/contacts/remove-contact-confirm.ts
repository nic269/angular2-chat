import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ConcreteContact } from '../../contacts';

@Component({
  selector: 'rio-remove-contact-confirm',
  template: `
    <div>
      Are you sure you would like to remove
      {{contact.username}} from your contacts?

      <div class="actions">
        <button (click)="onConfirm()" class="btn btn-primary">
          OK
        </button>
        <button (click)="onCancel()" class="btn">
          Cancel
        </button>
      </div>
    </div>
  `,
  styles: [require('./remove-contact-confirm.css')]
})
export class RioRemoveContactConfirm {
  @Input() private contact: ConcreteContact;

  @Output() private confirm = new EventEmitter<ConcreteContact>();
  @Output() private cancel = new EventEmitter<void>();

  private onConfirm() {
    this.confirm.emit(this.contact);
  }

  private onCancel() {
    this.cancel.emit(void 0);
  }
};
