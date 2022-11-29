import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VjInputData } from './classes/vj-input-data.class';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VjInputComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() invalid?: boolean;
  @Input() list?: VjInputData[];

  isLoading!: boolean;

  onLabel(): void {
    console.log('fô');
  }

  onClickAutocompleteItem(event: VjInputData): void {
    console.log(event)
  }
}
