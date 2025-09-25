import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'teacher@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  display_name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

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
