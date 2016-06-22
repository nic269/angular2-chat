import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFormModel } from '@angular/common';

@Component({
  selector: 'rio-form',
  template: `
    <form [ngFormModel]="formModel" (ngSubmit)="submit.emit($event)">
      <ng-content></ng-content>
    </form>
  `
})
export class RioForm {
  @Input() formModel: NgFormModel;

  @Output() submit = new EventEmitter<Event>();
};
