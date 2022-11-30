import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[vjMask]'
})
export class VjMaskDirective implements AfterContentInit {

  @Input() mask!: string;
  @Input() uppercase!: boolean;

  private value!: string;

  private readonly numberFlag = '#';
  private readonly alphaFlag = 'A';
  private readonly backspaceKey = 'Backspace';
  private readonly skipKeys = ['Tab', 'Esc', 'Delete', 'Home', 'End', 'Control', 'F12'];

  get fieldValue(): string {
    return this.element.nativeElement.value;
  }

  get lastChar(): string {
    return this.fieldValue.slice(-1);
  }

  get isAllValueSelected(): boolean {
    return (this.element.nativeElement.selectionStart === 0) && (this.element.nativeElement.selectionEnd === (this.fieldValue.length));
  }

  constructor(
    public element: ElementRef<HTMLInputElement>
  ) {
    element.nativeElement.addEventListener('keydown', (event) => {
      const keyValue = event.key as any;

      if (this.skipKeys.includes(event.key) || event.ctrlKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // Current replacement index
      let nextAlphaIndex = this.value.indexOf(this.alphaFlag);
      let nextNumberIndex = this.value.indexOf(this.numberFlag);

      // Next replacement index
      const index = ((nextAlphaIndex < nextNumberIndex) && (nextAlphaIndex !== -1)) ? nextAlphaIndex : nextNumberIndex;

      // Is the next a number?
      const isNextNumber = (nextNumberIndex === index);

      // Backspace
      if (keyValue === this.backspaceKey && !this.isAllValueSelected) {
        const missingFlags = this.mask.substring((this.fieldValue.length - 1), this.mask.length);
        this.value = this.fieldValue.substring(0, (this.fieldValue.length - 1));
        this.value = this.value.concat(missingFlags);
        this.element.nativeElement.value = this.value.replace(new RegExp(`${this.numberFlag}|${this.alphaFlag}`, 'gi'), '');
        if (this.lastChar === '-') {
          this.element.nativeElement.value = this.fieldValue.substring(0, this.fieldValue.length - 1);
        }
        this.resetValue();
        return;
      }

      // Backspace: all value selected
      if (keyValue === this.backspaceKey && this.isAllValueSelected) {
        this.element.nativeElement.value = '';
        this.resetValue();
        return;
      }

      // Ctrl+V or Ctrl+C

      // Number
      if (!isNaN(keyValue) && isNextNumber) {
        if (index > -1) {
          this.value = this.value.replace(this.numberFlag, keyValue);
          this.element.nativeElement.value = this.value.substring(0, (index + 1));
        }
      }

      // Alpha
      if (isNaN(keyValue) && !isNextNumber) {
        const index = this.value.indexOf(this.alphaFlag);
        if (index > -1) {
          this.value = this.value.replace(this.alphaFlag, keyValue);
          this.element.nativeElement.value = this.value.substring(0, (index + 1));
        }
      }

      // Reset
      this.resetValue();

      // Uppercase
      this.uppercaseValue();

    })
  }

  private uppercaseValue() {
    if (this.fieldValue.length && this.uppercase) {
      this.value = this.value.toUpperCase();
      this.element.nativeElement.value = this.fieldValue.toUpperCase();
    }
  }

  private resetValue() {
    if (!this.fieldValue.length) {
      this.value = this.mask;
    }
  }

  ngAfterContentInit(): void {
    this.value = `${this.mask}`;
  }

}
