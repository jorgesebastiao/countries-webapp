import { DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { CountryViewModel } from '@features/home/shared/models/countries.model';
import { WorldCupRole } from '@features/home/shared/models/world-cups.model';

@Component({
  selector: 'app-country-card',
  standalone: true,
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  imports: [MatCardModule, RouterModule, DecimalPipe, NgIf],
})
export class CountryCardComponent {
  @Input() country: CountryViewModel = {} as CountryViewModel;
  @Input() worldCupRole?: WorldCupRole;

  constructor(private router: Router) {}

  get isHost(): boolean {
    return this.worldCupRole === 'host' || this.worldCupRole === 'host-champion';
  }

  get isChampion(): boolean {
    return this.worldCupRole === 'champion' || this.worldCupRole === 'host-champion';
  }

  handleCountryDetail() {
    this.router.navigate([`country/${this.country.alpha3Code}`]);
  }
}
