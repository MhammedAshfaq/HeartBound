import { Controller, Get, Req, Res } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Request, Response } from 'express';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  async check(@Req() req: Request, @Res() res: Response) {
    const healthResult = await this.health.check([]);
    const accept = req.headers['accept'] || '';
    if (accept.includes('text/html')) {
      return res.render('health', {
        title: 'System Health Status',
        user: 'Developer',
        status: healthResult.status,
        info: healthResult.info,
      });
    }
    return res.json(healthResult);
  }
}
