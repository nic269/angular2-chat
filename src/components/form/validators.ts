import { Control } from '@angular/common';

export const expression = /^.+@.+\..+$/;

export const validateEmail = (control: Control) => {
  if (expression.test(control.value)) {
    return null;
  }
  return {
    validateEmail: false,
  };
};

