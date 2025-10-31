import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConsulService } from '@registry/consul';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly consulService: ConsulService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    try {
      const authServiceUrl = await this.consulService.resolveService('auth-service');

      const response = await this.httpService.axiosRef.get(
        `${authServiceUrl}/auth/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      request.user = response.data;
      return true;
    } catch (error) {
      console.error(' Auth validation failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
