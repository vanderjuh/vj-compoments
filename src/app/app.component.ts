import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { VjInputData } from './shared/components/vj-input/classes/vj-input-data.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'vj-compoments';

  formControl = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
  disabledFormControl = new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
  formControlAutocomplete = new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);

  list: Array<VjInputData> = [
    { value: 1, label: 'Test 1' },
    { value: 2, label: 'Test 2' },
    { value: 3, label: 'Test 3', disabled: true },
  ];

  ngOnInit(): void {
    this.disabledFormControl.disable();

    this.formControl.setValue('This is a Form Control.');
    this.formControl.valueChanges.subscribe((event) => console.log(event));
    this.formControlAutocomplete.valueChanges.subscribe((event) => console.log(event));
    this.formControl.statusChanges.subscribe((event) => console.log(event));
  }
}
