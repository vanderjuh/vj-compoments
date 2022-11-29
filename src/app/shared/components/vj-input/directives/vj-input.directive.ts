import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[vjInput]'
})
export class VjInputDirective {

  constructor(public element: ElementRef<HTMLInputElement>) {
    element.nativeElement.id = `vj-input-${new Date().getTime()}`
  }

}
