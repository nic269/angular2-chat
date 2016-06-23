import { Map } from 'immutable';

export enum Presence {
  Offline,
  Idle,
  Online,
};

export enum AddContactState {
  Idle,
  Loading,
  Adding,
  Failed
};

export enum MessageSource {
  Local,
  Remote
}

export interface Message {
  source: MessageSource;
  text: string;
};

// raw JavaScript object representation of a contact
export interface ConcreteContact {
  name: string;
  username: string;
  presence: Presence | string;
  lastSeen: Date;
  messages: Message[];
};

// immutablejs representation of a contact
export type Contact = Map<string, any>;
