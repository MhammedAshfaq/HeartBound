import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CountriesDbService } from '@db/countries/countries.service';
import { CacheService } from '@redis/cache.service';
import { ERROR_MESSAGES } from '@common/constants/error-messages.constants';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    private readonly countriesDbService: CountriesDbService,
    private readonly cacheService: CacheService
  ) {}

  async getAll() {
    try {
      const countries = await this.cacheService.getOrSetLong(
        'countries:list',
        () => this.countriesDbService.getAll()
      );
      if (!countries || countries.length === 0) {
        throw new NotFoundException(ERROR_MESSAGES.COUNTRIES.NOT_FOUND);
      }

      return countries;
    } catch (error) {
      this.logger.error('Error in CountriesService.getAll:', error);
      throw error;
    }
  }
}
