import { Pipe, PipeTransform } from '@angular/core';
import { LanguageViewModel } from '../models/countries.model';

@Pipe({
  name: 'languageFormat',
  standalone: true,
})
export class LanguageFormatPipe implements PipeTransform {
  transform(languages: LanguageViewModel[]): string {
    return languages.map((language) => language.name).join(', ');
  }
}
