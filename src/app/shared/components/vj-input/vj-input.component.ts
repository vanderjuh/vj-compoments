import { Component, Input } from '@angular/core';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss']
})
export class VjInputComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() invalid?: boolean;

  onLabel(): void {
    console.log('fô');
  }
}
