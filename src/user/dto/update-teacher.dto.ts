import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({ required: false, example: 'teacher@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'John Smith' })
  @IsOptional()
  @IsString()
  display_name?: string;

  @ApiProperty({ required: false, example: 'password123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

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
