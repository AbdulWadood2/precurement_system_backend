import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class ChartOfAccountsFiltersDto {
  @ApiProperty({ required: false, description: 'Account type filter' })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiProperty({ required: false, description: 'Root type filter' })
  @IsOptional()
  @IsString()
  rootType?: string;

  @ApiProperty({ required: false, description: 'Company filter' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Is enabled filter' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
