import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { CountryViewModel } from './models/countries.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly apiUrl: string;
  private fallbackUrl = 'assets/data.json';

  constructor(private httpClient: HttpClient) {
    this.apiUrl = `https://restcountries.com/v2`;
  }

  public getAll(): Observable<CountryViewModel[]> {
    return this.httpClient.get<CountryViewModel[]>(`${this.apiUrl}/all`).pipe(
      catchError(() => {
        return this.httpClient
          .get<CountryViewModel[]>(this.fallbackUrl)
          .pipe(
            catchError(() =>
              throwError(() => new Error('Falha ao carregar os dados'))
            )
          );
      })
    );
  }

  public getByAlpha3Code(alpha3Code: string): Observable<CountryViewModel> {
    return this.httpClient
      .get<CountryViewModel>(`${this.apiUrl}/alpha/${alpha3Code}`)
      .pipe(
        catchError((error) => {
          return this.httpClient.get<CountryViewModel[]>(this.fallbackUrl).pipe(
            map((countries) => {
              const findCountry = countries.find(
                (country) =>
                  country.alpha3Code.toLowerCase() === alpha3Code.toLowerCase()
              );
              if (findCountry) {
                return findCountry;
              }
              throw throwError(() => new Error('País não encontrado'));
            }),
            catchError(() => throwError(() => error))
          );
        })
      );
  }
}
