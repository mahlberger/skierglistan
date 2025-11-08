import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFormFieldColumn]',
  standalone: true
})
export class FormFieldColumnDirective {
  private mdColumnClass: string | null = null;

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {
    const host = this.elementRef.nativeElement;
    this.renderer.addClass(host, 'field');
    this.renderer.addClass(host, 'col-12');
  }

  @Input()
  set appFormFieldColumn(value: string | number | null) {
    if (this.mdColumnClass) {
      this.renderer.removeClass(this.elementRef.nativeElement, this.mdColumnClass);
      this.mdColumnClass = null;
    }
    if (value !== null && value !== undefined && value !== '') {
      const normalized = typeof value === 'number' ? value.toString() : value;
      this.mdColumnClass = `md:col-${normalized}`;
      this.renderer.addClass(this.elementRef.nativeElement, this.mdColumnClass);
    }
  }
}

