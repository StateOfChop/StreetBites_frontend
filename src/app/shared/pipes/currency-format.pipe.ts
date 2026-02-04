import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency = 'USD'): string {
    if (value == null) return '';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value);
  }
}
