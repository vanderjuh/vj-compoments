import { Component, Input } from '@angular/core';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss']
})
export class VjInputComponent {
  @Input() label?: string;

  onLabel(): void {
    console.log('fô');
  }
}
