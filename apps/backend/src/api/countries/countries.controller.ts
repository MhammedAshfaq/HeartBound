import { Controller, Get, Logger } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ERROR_MESSAGES } from '@common/constants/error-messages.constants';

@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAll() {
    try {
      return await this.countriesService.getAll();
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGES.COUNTRIES.FETCH_FAILED}:`, error);
      throw error;
    }
  }
}
