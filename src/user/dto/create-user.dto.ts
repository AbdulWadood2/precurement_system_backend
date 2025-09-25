import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '../roles/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  display_name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false, example: 'US' })
  @IsOptional()
  @IsString()
  country_code?: string;

  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  native_language_id?: string;

  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  ui_language_id?: string;
}
