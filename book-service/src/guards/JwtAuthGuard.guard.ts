
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConsulService } from '../consul/consul.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly consulService: ConsulService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    //  Không có token
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    //  Token format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    try {
      //  Lấy URL của auth-service từ Consul
      const authServiceUrl = await this.consulService.resolveService('auth-service');

      //  Gọi API xác thực
      const response = await this.httpService.axiosRef.get(
        `${authServiceUrl}/auth/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      //  Nếu xác thực hợp lệ, gán user info vào request
      request.user = response.data;
      return true;
    } catch (error: any) {
      console.error(' Auth validation failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
