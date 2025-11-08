import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[appFormField],textarea[appFormField],select[appFormField]',
  standalone: true
})
export class FormFieldDirective {
  constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
    const host = elementRef.nativeElement;
    const classes = [
      'text-base',
      'text-color',
      'surface-overlay',
      'p-3',
      'border-1',
      'border-solid',
      'surface-border',
      'border-round',
      'outline-none',
      'focus:border-primary',
      'w-full'
    ];
    classes.forEach((className) => renderer.addClass(host, className));
    if (host.tagName === 'SELECT') {
      renderer.setStyle(host, 'appearance', 'auto');
    } else {
      renderer.addClass(host, 'appearance-none');
    }
  }
}

