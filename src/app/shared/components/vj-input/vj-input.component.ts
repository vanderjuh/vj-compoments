import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

import { debounceTime, Subscription } from 'rxjs';

import { VjInputData } from './classes/vj-input-data.class';
import { VjInputDirective } from './directives/vj-input.directive';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: VjInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: VjInputComponent
    }
  ]
})
export class VjInputComponent implements AfterContentInit, OnInit, OnDestroy, ControlValueAccessor {

  @Input() label?: string;
  @Input() hint?: string;
  @Input() list: VjInputData[] = [];
  @Input() debounceTime: number = 500;
  @Input() waiving = false;

  @ContentChild(VjInputDirective) input?: VjInputDirective;

  isLoading!: boolean;
  filteredList!: VjInputData[];
  noResultsFound?: boolean;

  onChange = (_: any) => { };
  onTouched = () => { };

  touched = false;
  disabled = false;

  private _value = '';
  protected _formControl?: AbstractControl<any, any>;

  get hasAutocomplete(): boolean {
    return ((!!this.list.length) && !this.waiving);
  }

  get isFocused(): boolean {
    const el = document.activeElement;
    return ((el?.id === this.input?.element?.nativeElement?.id) && this.hasAutocomplete);
  }

  get value(): string {
    return (this.input?.element.nativeElement.value ?? '');
  }

  get invalid(): boolean {
    return (this._formControl?.invalid ?? false);
  }

  get errors(): string {
    const defaultError = 'Invalid field.';
    if (this._formControl?.errors) {
      const errors = Object.values(this._formControl.errors);
      const firstError = errors.length ? errors[0] : defaultError;
      console.log(errors)
      switch (firstError) {
        case 'true':
          return defaultError;
        default:
          return defaultError;
      }
    }
    return defaultError;
  }

  private searchingEvent = new EventEmitter<string>();
  private searchingSub!: Subscription;

  constructor() { }

  ngOnDestroy(): void {
    this.searchingSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.filteredList = this.list;
    this.searchingSub = this.searchingEvent
      .pipe(debounceTime(this.debounceTime))
      .subscribe((result) => {
        if (!this.hasAutocomplete)
          return;
        var evaluated = this.list?.filter(x => x.label.toLowerCase().trim().includes(result.toLowerCase().trim()));
        this.filteredList = (evaluated?.length) ? evaluated : this.list;
        this.noResultsFound = !evaluated?.length;
        this.isLoading = false;
      })
  }

  ngAfterContentInit(): void {
    this.setValue();
    this.setAutocomplete();
    this.setReactiveEvents();
  }

  onClickAutocompleteItem(event: VjInputData): void {
    if (this.input) {
      this.input.element.nativeElement.value = (this.input && !event.disabled) ? event.label : '';
      this.noResultsFound = false;
    }
  }

  reset(): void {
    if (this.input) {
      this.input.element.nativeElement.value = '';
      this.noResultsFound = false;
      this.markAsTouched();
      this.onChange(this.input.element.nativeElement.value);
    }
  }

  writeValue(value: any): void {
    this._value = value;
    if (this.input) {
      this.setValue();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): (ValidationErrors | null) {
    this._formControl = control;
    return control.validator;
  }

  private setValue(): void {
    if (this.input) {
      this.input.element.nativeElement.value = this._value;
    }
  }

  private setAutocomplete(): void {
    if (this.input && this.hasAutocomplete) {
      this.input.element.nativeElement.addEventListener('keyup', () => {
        this.isLoading = true;
        this.noResultsFound = false;
        this.searchingEvent.emit(this.value);
      });
      this.input.element.nativeElement.addEventListener('focus', () => {
        this.isFocused;
        const selectedValue = this.list.find(x => this.value.length && x.label.toLowerCase().trim().includes(this.value.toLowerCase().trim()));
        if (selectedValue) {
          this.filteredList = [selectedValue];
        }
        this.markAsTouched();
      });
      this.input.element.nativeElement.addEventListener('focusout', () => {
        this.isFocused;
        this.filteredList = this.list;
      });
    }
  }

  setReactiveEvents() {
    if (this.input) {
      this.input.element.nativeElement.addEventListener('input', (event) => {
        this.onChange(this.input?.element?.nativeElement?.value);
      })
      if (!this.hasAutocomplete) {
        this.input.element.nativeElement.addEventListener('focus', () => {
          this.markAsTouched();
        });
      }
    }
  }
}
