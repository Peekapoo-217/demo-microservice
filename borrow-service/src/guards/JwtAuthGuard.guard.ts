import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthClientService } from '../clients/auth-client.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authClientService: AuthClientService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) return false;
        const token = authHeader.split(' ')[1];
        const user = await this.authClientService.validateToken(token);
        request.user = user;
        return true;
    }
}
