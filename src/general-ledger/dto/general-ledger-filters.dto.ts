import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GeneralLedgerFiltersDto {
  @ApiProperty({ required: false, description: 'Account number filter' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ required: false, description: 'Account filter' })
  @IsOptional()
  @IsString()
  account?: string;

  @ApiProperty({ required: false, description: 'Company filter' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Date filter' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ required: false, description: 'Start date filter' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'End date filter' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
