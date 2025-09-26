import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '../roles/roles.enum';
import { Language } from '../enums/language.enum';

export class UpdateUserFormDto {
  @ApiProperty({ required: false, example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  display_name?: string;

  @ApiProperty({ required: false, example: 'password123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false, enum: UserRole, example: UserRole.MEMBER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false, example: 'US' })
  @IsOptional()
  @IsString()
  country_code?: string;

  @ApiProperty({
    required: false,
    enum: Language,
    example: Language.ENGLISH,
    description: 'Native language of the user',
  })
  @IsOptional()
  @IsEnum(Language)
  native_language_id?: Language;

  @ApiProperty({
    required: false,
    enum: Language,
    example: Language.ENGLISH,
    description: 'UI language preference of the user',
  })
  @IsOptional()
  @IsEnum(Language)
  ui_language_id?: Language;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile image file (JPEG, PNG, GIF)',
    required: false,
  })
  @IsOptional()
  profile_image?: Express.Multer.File;
}
