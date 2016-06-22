import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Control,
  Validators
} from '@angular/common';

import {
  RioForm,
  RioFormError,
  RioFormGroup,
  RioLabel
} from '../form';
import { RioAlert } from '../alert';
import { RioButton } from '../button';
import { RioInput } from '../form/input';
import { validateEmail } from '../form/validators';

@Component({
  selector: 'rio-login-form',
  directives: [
    FORM_DIRECTIVES,
    RioAlert,
    RioButton,
    RioInput,
    RioForm,
    RioFormError,
    RioFormGroup,
    RioLabel
  ],
  template: `
    <rio-form [formModel]="group" (submit)="onSubmit()">
      <rio-alert qaid="qa-pending" status='info'
        *ngIf="pending">Loading...</rio-alert>
      <rio-alert qaid="qa-alert" status='error' *ngIf="failure">
        Invalid username and password
      </rio-alert>

      <rio-form-group>
        <rio-label qaid="qa-name-label">Name</rio-label>
        <rio-input
          qaid="qa-name-input"
          inputType="text"
          placeholder="Your full name"
          [formControl]="fullname">
        </rio-input>
      </rio-form-group>

      <rio-form-group>
        <rio-label qaid="qa-uname-label">Email</rio-label>
        <rio-input
          qaid="qa-uname-input"
          inputType='text'
          placeholder='Email address'
          [formControl]="username">
        </rio-input>
        <rio-form-error
          qaid="qa-uname-validation"
          [visible]="username.touched && username.valid === false">
          Please enter a valid email address
        </rio-form-error>
      </rio-form-group>

      <rio-form-group>
        <rio-label qaid="qa-password-label">Password</rio-label>
        <rio-input
          qaid="qa-password-input"
          inputType='password'
          placeholder='Password'
          [formControl]="password"></rio-input>
        <rio-form-error
          qaid="qa-password-validation"
          [visible]="password.touched && password.valid === false">
          Password is required
        </rio-form-error>
      </rio-form-group>

      <rio-form-group>
        <rio-button
          qaid="qa-login-button"
          [disabled]="valid() === false"
          className="mr1"
          type="submit">
          Login
        </rio-button>
        <rio-button
          qaid="qa-clear-button"
          className="bg-red"
          (onClick)="onReset()">
          Clear
        </rio-button>
      </rio-form-group>
    </rio-form>
  `
})
export class RioLoginForm {
  @Input() pending: boolean;
  @Input() failure: boolean;
  @Output() submit: EventEmitter<Object> = new EventEmitter();

  private fullname: Control;
  private username: Control;
  private password: Control;
  private group: ControlGroup;

  constructor(private builder: FormBuilder) {
    this.onReset();
  }

  private valid() {
    return this.username.valid && this.password.valid;
  }

  private onSubmit() {
    this.submit.emit(this.group.value);
  }

  private onReset() {
    const validEmail = Validators.compose([Validators.required, validateEmail]);

    this.fullname = new Control(null);
    this.username = new Control(null, validEmail);
    this.password = new Control(null, Validators.required);

    this.failure = false;

    this.pending = false;

    this.group = this.builder.group({
      fullname: this.fullname,
      username: this.username,
      password: this.password,
    });
  }
};
