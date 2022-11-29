import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VjInputDirective } from './directives/vj-input.directive';
import { VjInputComponent } from './vj-input.component';

@NgModule({
  declarations: [
    VjInputComponent,
    VjInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VjInputComponent,
    VjInputDirective
  ]
})
export class VjInputModule { }
