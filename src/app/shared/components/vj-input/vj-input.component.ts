import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControlDirective, ValidationErrors } from '@angular/forms';

import { debounceTime, Subscription } from 'rxjs';

import { VjInputData } from './classes/vj-input-data.class';
import { VjInputDirective } from './directives/vj-input.directive';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss']
})
export class VjInputComponent implements AfterContentInit, OnInit, OnDestroy, ControlValueAccessor {

  @Input() label?: string;
  @Input() hint?: string;
  @Input() list: VjInputData[] = [];
  @Input() debounceTime: number = 500;
  @Input() waiving = false;
  @Output() selected = new EventEmitter<VjInputData>();

  @ContentChild(VjInputDirective) private _input?: VjInputDirective;
  @ContentChild(FormControlDirective) private _formControl?: FormControlDirective;

  isLoading!: boolean;
  filteredList!: VjInputData[];
  noResultsFound?: boolean;

  onChange = (_: any) => { };
  onTouched = () => { };

  touched = false;

  private _value = '';

  get hasAutocomplete(): boolean {
    return ((!!this.list.length) && !this.waiving);
  }

  get isFocused(): boolean {
    const el = document.activeElement;
    return ((el?.id === this._input?.element?.nativeElement?.id) && this.hasAutocomplete);
  }

  get value(): string {
    return (this._input?.element.nativeElement.value ?? '');
  }

  get invalid(): boolean {
    return (this._formControl?.invalid ?? false);
  }

  get errors(): string {
    const defaultError = 'Invalid field.';
    if (this._formControl?.errors) {
      const errors = Object.values(this._formControl.errors);
      const firstError = errors.length ? errors[0] : defaultError;
      switch (firstError) {
        case 'true':
          return defaultError;
        default:
          return defaultError;
      }
    }
    return defaultError;
  }

  get isDisabled(): boolean {
    return (this._formControl?.disabled ?? this._input?.element.nativeElement.disabled ?? false);
  }

  get interacted(): boolean {
    return ((this._formControl?.dirty) ?? false);
  }

  private searchingEvent = new EventEmitter<string>();
  private searchingSub!: Subscription;

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
        this.noResultsFound = (evaluated?.length ? false : true);
        if (this.noResultsFound) {
          this._formControl?.control?.setErrors({ 'noResultsFound': true })
        } else {
          const errors = (this._formControl?.errors ?? {});
          delete errors['noResultsFound'];
          this._formControl?.control?.setErrors(errors);
        }
        this.isLoading = false;
      })
  }

  ngAfterContentInit(): void {
    this.setValue();
    this.setAutocomplete();
    this.setReactiveEvents();
    this.markAsDisabled(this.isDisabled);
  }

  onClickAutocompleteItem(event: VjInputData): void {
    if (this._input) {
      this.noResultsFound = false;
      this._formControl?.control?.setValue(event.value);
      this._input.element.nativeElement.value = ((this._input && !event.disabled) ? event.label : '');
      this.selected.emit(event);
    }
  }

  reset(): void {
    if (this._input) {
      this._formControl?.reset();
      this._input.element.nativeElement.value = '';
      this.noResultsFound = false;
      this.markAsTouched();
      this.onChange(this._input.element.nativeElement.value);
    }
  }

  writeValue(value: any): void {
    this._value = value;
    if (this._input) {
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
    this.markAsDisabled(isDisabled);
  }

  private markAsDisabled(status?: boolean) {
    if (this._formControl || status != null) {
      if (this._input) {
        this._input.element.nativeElement.disabled = (status ?? false);
      }
    }
  }

  validate(control: AbstractControl): (ValidationErrors | null) {
    return control.validator;
  }

  private setValue(): void {
    if (this._input) {
      if (this.hasAutocomplete) {
        const associatedItem = this.list.find(x => x.value === this._value);
        this._input.element.nativeElement.value = (associatedItem ? associatedItem.label : this._value);
      } else {
        this._input.element.nativeElement.value = this._value;
      }
    }
  }

  private setAutocomplete(): void {
    if (this._input && this.hasAutocomplete) {
      this._input.element.nativeElement.addEventListener('keyup', () => {
        this.isLoading = true;
        this.noResultsFound = false;
        this.searchingEvent.emit(this.value);
      });
      this._input.element.nativeElement.addEventListener('focus', () => {
        this.isFocused;
        const selectedValue = this.list.find(x => this.value.length && x.label.toLowerCase().trim().includes(this.value.toLowerCase().trim()));
        if (selectedValue) {
          this.filteredList = [selectedValue];
        }
        this.markAsTouched();
      });
      this._input.element.nativeElement.addEventListener('focusout', () => {
        this.isFocused;
        this.filteredList = this.list;
        this._formControl?.control?.markAsDirty();
      });
    }
  }

  setReactiveEvents() {
    if (this._input) {
      this._input.element.nativeElement.addEventListener('input', () => {
        if (!this.hasAutocomplete) {
          this.onChange(this._input?.element?.nativeElement?.value);
        }
      })
      if (!this.hasAutocomplete) {
        this._input.element.nativeElement.addEventListener('focus', () => {
          this.markAsTouched();
        });

        this._input.element.nativeElement.addEventListener('focusout', () => {
          this._formControl?.control?.markAsDirty();
        });
      }
    }
  }
}
