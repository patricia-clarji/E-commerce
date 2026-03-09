import { ElementRef } from '@angular/core';
import { ClickOutsideDirective } from './click-outside';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('div'));
    const directive = new ClickOutsideDirective(el);

    expect(directive).toBeTruthy();
  });
});
