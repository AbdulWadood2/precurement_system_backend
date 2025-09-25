import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  native_language_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ui_language_id?: string;
}
