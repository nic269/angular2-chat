import {
  Component,
  ElementRef,
  Input,
} from '@angular/core';

import { select } from 'ng2-redux';

import { List } from 'immutable';

import { Observable } from 'rxjs';

import {
  Contact,
  ConcreteContact
} from '../../contacts';
import { Conversation } from '../../reducers/conversation';
import {
  ConversationActions,
  MessageSource,
  Message,
} from '../../actions/conversation';

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

  @Input() participant: Contact;

  private messageSource = MessageSource;

  constructor(
    private actions: ConversationActions,
    private element: ElementRef) {}

  private getMessages() {
    if (this.participant == null) {
      return [];
    }

    const messages: List<Message> = this.participant.get('messages');
    if (messages == null) {
      return [];
    }

    return messages.toJS();
  }

  private oldScroll: number;

  private get messagesContainer() {
    return this.element.nativeElement.querySelector('.messages');
  }

  private ngAfterContentInit () {
    const container = this.messagesContainer;

    container.scrollTop = container.scrollHeight;

    const interval = 500;

    // NOTE(cbond): The most horrendous autoscroll implementation y'all ever saw
    setInterval(() => {
      if (this.oldScroll !== this.element.nativeElement.scrollHeight) {
        this.oldScroll = container.scrollHeight;
        container.scrollTop = container.scrollHeight;
      }
    }, interval);
  }

  private onClose() {
    this.actions.close();
  }

  private onSend(event, contact) {
    const message = event.currentTarget.value;
    if (!message) {
      return;
    }

    event.currentTarget.value = '';

    this.actions.send(contact, message);
  }
};

