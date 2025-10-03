import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/enums/role.enum';

export class CreateUserDto {
    @IsNotEmpty()
    email!: string;

    @MinLength(6)
    password!: string;

    @IsEnum(UserRole)
    role?: UserRole;
}
