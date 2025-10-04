import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthClientService {
    constructor(private readonly httpService: HttpService) { }

    async validateToken(token: string) {
        try {
            const response = await this.httpService.axiosRef.get(
                'http://localhost:3001/auth/validate',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error("Token validation failed:", error.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
