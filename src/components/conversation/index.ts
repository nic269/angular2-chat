import {
  Component,
  Input,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ConcreteContact } from '../../contacts';
import { ConversationActions } from '../../actions/conversations';

@Component({
  selector: 'conversation',
  template: require('./conversation.tmpl.html'),
  styles: [require('./conversation.css')]
})
export class Conversation {
  @Input() private participant$: Observable<ConcreteContact>;

  constructor(private actions: ConversationActions) {}

  private onClose() {

  }

  private onSendMessage(message: string) {

  }
}