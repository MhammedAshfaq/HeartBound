import { Injectable } from '@nestjs/common';
import { CountriesRepository } from './countries.repository';

@Injectable()
export class CountriesDbService {
  constructor(private readonly countriesRepository: CountriesRepository) {}

  async getAll() {
    return this.countriesRepository.findAll();
  }
}
