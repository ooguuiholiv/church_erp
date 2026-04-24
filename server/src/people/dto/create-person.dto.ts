import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PersonStatus } from '@prisma/client';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(PersonStatus)
  @IsOptional()
  status?: PersonStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
