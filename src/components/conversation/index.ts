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

export enum MessageSource {
  Local,
  Remote
}

export interface Message {
  source: MessageSource;
  text: string;
};

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

  private messages: Message[] = [];

  private messageSource = MessageSource;

  constructor(private actions: ConversationActions) {
    this.participant$ = this.conversation$.map(c => c.get('participant'));
  }

  private addLocalMessage(text) {
    this.messages.push({
      source: MessageSource.Local,
      text
    });
  }

  private addRemoteMessage(text) {
    this.messages.push({
      source: MessageSource.Remote,
      text
    });
  }

  private onClose() {
    this.actions.close();
  }

  private onSend(event) {
    this.addLocalMessage(event.currentTarget.value);

    event.currentTarget.value = '';
  }
};

