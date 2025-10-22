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
      //  Lấy URL động của auth-service từ Consul
      const authServiceUrl = await this.consulService.resolveService('auth-service');

      //  Gọi xác thực token
      const response = await this.httpService.axiosRef.get(
        `${authServiceUrl}/auth/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      //  Nếu hợp lệ → lưu thông tin user
      request.user = response.data;
      return true;
    } catch (error) {
      console.error(' Auth validation failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
