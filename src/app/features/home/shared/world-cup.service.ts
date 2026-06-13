import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { WorldCupViewModel } from './models/world-cups.model';

@Injectable({
  providedIn: 'root',
})
export class WorldCupService {
  private readonly dataUrl = 'assets/world-cups.json';
  private readonly editions$: Observable<WorldCupViewModel[]>;

  constructor(httpClient: HttpClient) {
    this.editions$ = httpClient.get<WorldCupViewModel[]>(this.dataUrl).pipe(
      map((editions) => [...editions].sort((a, b) => b.year - a.year)),
      shareReplay(1)
    );
  }

  public getEditions(): Observable<WorldCupViewModel[]> {
    return this.editions$;
  }

  public getByYear(year: number): Observable<WorldCupViewModel | undefined> {
    return this.editions$.pipe(
      map((editions) => editions.find((edition) => edition.year === year))
    );
  }
}
