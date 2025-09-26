import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { Language } from '../enums/language.enum';

export class UpdateProfileFormDto {
  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  display_name?: string;

  @ApiProperty({ required: false, example: 'US' })
  @IsOptional()
  @IsString()
  country_code?: string;

  @ApiProperty({
    required: false,
    enum: Language,
    description: 'Native language of the user',
  })
  @IsOptional()
  @IsEnum(Language)
  native_language_id?: Language;

  @ApiProperty({
    required: false,
    enum: Language,
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
