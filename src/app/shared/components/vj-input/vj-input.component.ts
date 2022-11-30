import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';

import { debounceTime, Subscription } from 'rxjs';

import { VjInputData } from './classes/vj-input-data.class';
import { VjInputDirective } from './directives/vj-input.directive';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss']
})
export class VjInputComponent implements AfterContentInit, OnInit, OnDestroy {

  @Input() label?: string;
  @Input() hint?: string;
  @Input() invalid?: boolean;
  @Input() list: VjInputData[] = [];
  @Input() debounceTime: number = 500;
  @Input() waiving = false;

  @ContentChild(VjInputDirective) input?: VjInputDirective;

  isLoading!: boolean;

  filteredList!: VjInputData[];
  noResultsFound?: boolean;

  get autocomplete(): boolean {
    return !!this.list.length;
  }

  get isFocused(): boolean {
    const el = document.activeElement;
    return (el?.id === this.input?.element?.nativeElement?.id);
  }

  get value(): string {
    return (this.input?.element.nativeElement.value ?? '');
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
        if (!this.autocomplete)
          return;
        var evaluated = this.list?.filter(x => x.label.toLowerCase().trim().includes(result.toLowerCase().trim()));
        this.filteredList = (evaluated?.length) ? evaluated : this.list;
        this.noResultsFound = !evaluated?.length;
        this.isLoading = false;
      })
  }

  ngAfterContentInit(): void {
    if (this.input && this.autocomplete) {
      this.input.element.nativeElement.addEventListener('keyup', () => {
        this.isLoading = true;
        this.noResultsFound = false;
        this.searchingEvent.emit(this.value)
      })
      this.input.element.nativeElement.addEventListener('focus', () => {
        this.isFocused;
        const selectedValue = this.list.find(x => this.value.length && x.label.toLowerCase().trim().includes(this.value.toLowerCase().trim()));
        if (selectedValue) {
          this.filteredList = [selectedValue];
        }
      })
      this.input.element.nativeElement.addEventListener('focusout', () => {
        this.isFocused;
        this.filteredList = this.list;
      })
    }
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
    }
  }
}
