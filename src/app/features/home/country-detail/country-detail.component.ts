import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountryViewModel } from '../shared/models/countries.model';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CurrencyFormatPipe } from '../shared/pipes/currency-format.pipe';
import { LanguageFormatPipe } from '../shared/pipes/language-format.pipe';
import { Location } from '@angular/common';
import { CountryService } from '../shared/country.service';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    DecimalPipe,
    CurrencyFormatPipe,
    LanguageFormatPipe,
  ],
})
export class CountryDetailComponent implements OnInit {
  country: CountryViewModel = {} as CountryViewModel;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
    });
  }

  handleBack() {
    this.location.back();
  }

  handleNavigateBorder(borderCountry: string) {
    this.router.navigate(['country', borderCountry]);
  }

  get borderCountries() {
    return this.country?.borders;
  }

  hasBorders(): boolean {
    return this.borderCountries && this.borderCountries.length > 0;
  }
}
