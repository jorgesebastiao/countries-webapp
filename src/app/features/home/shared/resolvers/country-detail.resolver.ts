import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CountryService } from "../country.service";
import { CountryViewModel } from "../models/countries.model";

export const countryDetailResolver: ResolveFn<CountryViewModel> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    return inject(CountryService).getByAlpha3Code(route.params['countryAlpha3Code']);
  };
  