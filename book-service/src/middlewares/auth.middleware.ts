import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Missing header');
        }

        const token = authHeader.split(' ')[1];

        try {
            const res = await axios.post('http://localhost:3001/auth/validate', { token });

            request['user'] = res.data.user;
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}