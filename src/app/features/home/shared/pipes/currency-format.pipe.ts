import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyViewModel } from '../models/countries.model';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(currencies: CurrencyViewModel[]): string {
    return currencies.map((currency) => currency.name).join(', ');
  }
}
