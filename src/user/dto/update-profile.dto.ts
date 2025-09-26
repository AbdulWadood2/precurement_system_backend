import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { Language } from '../enums/language.enum';

export class UpdateProfileDto {
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
}
