import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { VjInputData } from './shared/components/vj-input/classes/vj-input-data.class';
import { VjInputValidator } from './shared/components/vj-input/classes/vj-input-validator.class';
import { VjInputErrorKeyEnum } from './shared/components/vj-input/enums/vj-input-error-key.enum';

class CustomVjValidator extends VjInputValidator {
  override[VjInputErrorKeyEnum.required]: string = 'Esse campo é obrigatório (PT-BR).';
  override[VjInputErrorKeyEnum.noResultsFound]: string = 'Nenhum resultado encontrado (PT-BR)';
  override[VjInputErrorKeyEnum.defaultError]: string = 'Putz, campo inválido (PT-BR).';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'vj-compoments';

  formControl = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
  customValidatorFormControl = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
  disabledFormControl = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
  formControlAutocomplete = new FormControl('', [Validators.required]);

  customValidator = new CustomVjValidator();

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
