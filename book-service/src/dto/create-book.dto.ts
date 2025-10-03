import { IsString, IsNotEmpty, IsNumber, Min, IsISBN } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn!: string;

  @IsNumber()
  @Min(1)
  totalCopies: number = 1;
}
