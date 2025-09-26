import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateChartOfAccountsDto {
  @ApiProperty({ required: false, description: 'Account number' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ required: false, description: 'Account name' })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiProperty({ required: false, description: 'Account type' })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiProperty({ required: false, description: 'Parent account' })
  @IsOptional()
  @IsString()
  parentAccount?: string;

  @ApiProperty({ required: false, description: 'Root type' })
  @IsOptional()
  @IsString()
  rootType?: string;

  @ApiProperty({ required: false, description: 'Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, description: 'Is enabled' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Account balance' })
  @IsOptional()
  @IsNumber()
  accountBalance?: number;
}
