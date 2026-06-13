import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountryCardComponent } from './components/country-card/country-card.component';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { CountryViewModel } from './shared/models/countries.model';
import { WorldCupRole, WorldCupViewModel } from './shared/models/world-cups.model';
import { CommonModule } from '@angular/common';
import { CountryDataService } from './shared/country-data.service';
import { WorldCupService } from './shared/world-cup.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CountryCardComponent,
  ],
  providers: [CountryDataService]
})
export class HomeComponent implements OnInit {
  searchForm!: FormGroup;
  $countries!: Observable<CountryViewModel[]>;
  worldCupEditions: WorldCupViewModel[] = [];
  selectedEdition?: WorldCupViewModel;

  constructor(
    private formBuilder: FormBuilder,
    private countryDataService: CountryDataService,
    private worldCupService: WorldCupService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCountries();
    this.loadWorldCups();
  }

  initializeForm() {
    this.searchForm = this.formBuilder.group({
      search: [null],
      region: [null],
      worldCup: [null],
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((search) => {
        this.selectedEdition = this.worldCupEditions.find(
          (edition) => edition.year === search?.worldCup
        );
        this.countryDataService.filter(
          search?.search,
          search?.region,
          search?.worldCup
        );
      });
  }

  loadCountries() {
    this.$countries = this.countryDataService.getAll();
  }

  loadWorldCups() {
    this.worldCupService.getEditions().subscribe((editions) => {
      this.worldCupEditions = editions;
    });
  }

  handleClearFilter() {
    this.searchForm.get('region')?.reset();
    this.searchForm.get('worldCup')?.reset();
  }

  getWorldCupRole(country: CountryViewModel): WorldCupRole | undefined {
    const edition = this.selectedEdition;
    if (!edition) {
      return undefined;
    }
    const isHost = edition.hosts.includes(country.alpha3Code);
    const isChampion = edition.champion === country.alpha3Code;
    if (isHost && isChampion) {
      return 'host-champion';
    }
    if (isChampion) {
      return 'champion';
    }
    if (isHost) {
      return 'host';
    }
    return undefined;
  }
}
