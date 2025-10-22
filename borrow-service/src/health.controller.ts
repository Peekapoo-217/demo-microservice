import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      service: 'borrow-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
