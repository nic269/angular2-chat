import {
  Component,
  Input,
} from '@angular/core';

import { select } from 'ng2-redux';

import { Observable } from 'rxjs';

import { ConcreteContact } from '../../contacts';
import { Conversation } from '../../reducers/conversation';
import { ConversationActions } from '../../actions/conversation';

import { RioButton } from '../button';
import {
  RioModal,
  RioModalContent
} from '../modal';

@Component({
  selector: 'rio-conversation',
  template: require('./index.tmpl.html'),
  styles: [require('./index.css')],
  directives: [
    RioButton,
    RioModal,
    RioModalContent
  ]
})
export class RioConversation {
  @select() private conversation$: Observable<Conversation>;

  private participant$: Observable<ConcreteContact>;

  constructor(private actions: ConversationActions) {
    this.participant$ = this.conversation$.map(c => c.get('participant'));
  }

  private onClose() {
    this.actions.close();
  }

  private onSendMessage(message: string) {

  }
}