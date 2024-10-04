export interface CountryViewModel {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  topLevelDomain: string[];
  capital: string;
  region: string;
  subregion: string;
  population: number;
  borders: string[];
  nativeName: string;
  currencies: CurrencyViewModel[];
  languages: LanguageViewModel[];
  flags: FlagViewModel;
}

export interface CurrencyViewModel {
  code: string;
  name: string;
  symbol: string;
}

export interface LanguageViewModel {
  iso639_1: string;
  iso639_2: string;
  name: string;
  nativeName: string;
}

export interface FlagViewModel {
  svg: string;
  png: string;
}
