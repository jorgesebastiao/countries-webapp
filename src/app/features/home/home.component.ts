import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountryCardComponent } from './components/country-card/country-card.component';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { CountryViewModel } from './shared/models/countries.model';
import { CommonModule } from '@angular/common';
import { CountryDataService } from './shared/country-data.servuce';

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
})
export class HomeComponent implements OnInit {
  searchForm!: FormGroup;
  $countries!: Observable<CountryViewModel[]>;

  constructor(
    private formBuilder: FormBuilder,
    private countryDataService: CountryDataService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCountries();
  }

  initializeForm() {
    this.searchForm = this.formBuilder.group({
      search: [null],
      region: [null],
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((search) =>
        this.countryDataService.filter(search?.search, search?.region)
      );
  }

  loadCountries() {
    this.$countries = this.countryDataService.getAll();
  }

  handleClearFilter() {
    this.searchForm.get('region')?.reset();
  }
}
