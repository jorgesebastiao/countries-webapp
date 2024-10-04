import { Routes } from '@angular/router';
import { HomeComponent } from './features';
import { CountryDetailComponent } from '@features/home/country-detail/country-detail.component';
import { countryDetailResolver } from '@features/home/shared/resolvers/country-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:countryAlpha3Code',
    component: CountryDetailComponent,
    resolve: {
      country: countryDetailResolver,
    },
  },
];
