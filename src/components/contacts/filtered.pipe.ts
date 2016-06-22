import { Pipe, PipeTransform } from '@angular/core';

import { Observable } from 'rxjs';

import {
  Contact,
  ConcreteContact
} from '../../contacts';

@Pipe({ name: 'filtered' })
export class FilteredPipe implements PipeTransform {
  transform(
      contacts: ConcreteContact[],
      existingContacts: ConcreteContact[],
      search: string) {
    if (contacts == null || contacts.length === 0) {
      return contacts;
    }

    const match = (element, f) => {
      const exists = existingContacts.find(
        c => c.username === element.username);
      if (exists) {
        return false;
      }

      if (search == null || search.length === 0) {
        return true;
      }

      const value = f(element);
      if (value == null || value.length === 0) {
        return true;
      }

      return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    };

    return contacts.filter(e =>
      match(e, c => c.name) ||
      match(e, c => c.username));
  }
}
