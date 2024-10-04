import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { CountryViewModel } from '@features/home/shared/models/countries.model';

@Component({
  selector: 'app-country-card',
  standalone: true,
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  imports: [MatCardModule, RouterModule, DecimalPipe],
})
export class CountryCardComponent {
  @Input() country: CountryViewModel = {} as CountryViewModel;

  constructor(private router: Router) {}

  handleCountryDetail() {
    this.router.navigate([`country/${this.country.alpha3Code}`]);
  }
}
