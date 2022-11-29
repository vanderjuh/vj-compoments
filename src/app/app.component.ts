import { Component } from '@angular/core';

import { VjInputData } from './shared/components/vj-input/classes/vj-input-data.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vj-compoments';

  list: Array<VjInputData> = [
    { value: 1, label: 'Test 1' },
    { value: 2, label: 'Test 2' },
    { value: 3, label: 'Test 3', disabled: true },
  ];
}
