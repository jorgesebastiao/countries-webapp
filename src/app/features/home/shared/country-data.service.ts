import { Injectable } from '@angular/core';
import { CountryViewModel } from './models/countries.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CountryService } from './country.service';
import { WorldCupService } from './world-cup.service';
import { WorldCupViewModel } from './models/world-cups.model';

@Injectable()
export class CountryDataService {
  private readonly _countries = new BehaviorSubject<CountryViewModel[]>([]);
  private countriesApi: CountryViewModel[] = [];
  private worldCups: WorldCupViewModel[] = [];
  readonly countries = this._countries.asObservable();
  constructor(countryService: CountryService, worldCupService: WorldCupService) {
    countryService.getAll().subscribe((result) => {
      this.countriesApi = result;
      this._countries.next(result);
    });
    worldCupService.getEditions().subscribe((editions) => {
      this.worldCups = editions;
    });
  }

  public getAll(): Observable<CountryViewModel[]> {
    return this.countries;
  }

  public filter(name?: string, region?: string, worldCupYear?: number) {
    const participants = this.getParticipants(worldCupYear);
    let filteredCountries = this.countriesApi.filter((country) => {
      if (participants && !participants.has(country.alpha3Code)) {
        return false;
      }

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

  private getParticipants(worldCupYear?: number): Set<string> | undefined {
    if (!worldCupYear) {
      return undefined;
    }
    const edition = this.worldCups.find((cup) => cup.year === worldCupYear);
    return edition ? new Set(edition.participants) : undefined;
  }
}
