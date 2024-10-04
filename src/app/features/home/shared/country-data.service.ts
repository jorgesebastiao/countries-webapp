import { Injectable } from '@angular/core';
import { CountryViewModel } from './models/countries.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CountryService } from './country.service';

@Injectable()
export class CountryDataService {
  private readonly _countries = new BehaviorSubject<CountryViewModel[]>([]);
  private countriesApi: CountryViewModel[] = [];
  readonly countries = this._countries.asObservable();
  constructor(countryService: CountryService) {
    countryService.getAll().subscribe((result) => {
      this.countriesApi = result;
      this._countries.next(result);
    });
  }

  public getAll(): Observable<CountryViewModel[]> {
    return this.countries;
  }

  public filter(name?: string, region?: string) {
    let filteredCountries = this.countriesApi.filter((country) => {
      if (name && region) {
        return (
          country.name.toLowerCase().startsWith(name.toLowerCase()) &&
          country.region.toLowerCase().startsWith(region.toLowerCase())
        );
      }

      if (name) {
        return country.name.toLowerCase().startsWith(name.toLowerCase());
      }

      if (region) {
        return country.region.toLowerCase().startsWith(region.toLowerCase());
      }

      return true;
    });
    this._countries.next(filteredCountries);
  }
}
