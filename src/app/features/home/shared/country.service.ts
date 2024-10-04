import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryViewModel } from './models/countries.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiUrl = `https://restcountries.com/v2`;
  }

  public getAll(): Observable<CountryViewModel[]> {
    return this.httpClient.get<CountryViewModel[]>(`${this.apiUrl}/all`);
  }

  public getByAlpha3Code(alpha3Code: string): Observable<CountryViewModel> {
    return this.httpClient.get<CountryViewModel>(
      `${this.apiUrl}/alpha/${alpha3Code}`
    );
  }
}
