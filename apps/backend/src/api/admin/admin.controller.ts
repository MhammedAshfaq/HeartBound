import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  index() {
    return this.adminService.getDashboard();
  }
}
