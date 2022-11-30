import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[vjInput]'
})
export class VjInputDirective {

  @Input() type: 'text' = 'text';

  constructor(
    public element: ElementRef<HTMLInputElement>
  ) {
    element.nativeElement.id = `vj-input-${new Date().getTime()}`
    element.nativeElement.type = this.type;
  }

}
