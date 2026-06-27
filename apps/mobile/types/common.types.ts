export interface CountryDto {
  id: string;
  name: string;
  isoCode: string;
  dialCode: string;
  flagUrl: string;
  currency: string;
  isActive: boolean;
}

export interface CountriesApiResponse {
  success: boolean;
  data: CountryDto[];
  timestamp: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
