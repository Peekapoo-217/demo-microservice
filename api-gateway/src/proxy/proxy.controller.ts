import { All, Controller, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxyService: ProxyService) { }

  @All('*')
  async forwardRequest(@Req() req: Request) {
    try {
      const serviceName = this.getServiceNameFromPath(req.url);

      this.logger.log(`Routing ${req.method} ${req.url} -> ${serviceName}`);

      return await this.proxyService.forwardRequest(
        serviceName,
        req.url,
        req.method,
        req.headers,
        req.body,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to forward request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getServiceNameFromPath(url: string): string {
    const path = url.split('?')[0];
    const segments = path.split('/').filter(segment => segment.length > 0);

    if (segments.length === 0) {
      throw new HttpException(
        'Invalid request path. Expected format: /{service-prefix}/...',
        HttpStatus.BAD_REQUEST,
      );
    }

    const prefix = segments[0];
    const serviceName = `${prefix}-service`;

    return serviceName;
  }
}

