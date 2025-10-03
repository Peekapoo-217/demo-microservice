import { UserRole } from "../entities/enums/role.enum";
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsEnum(UserRole)
    role!: UserRole;
}