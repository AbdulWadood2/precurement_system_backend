import { ApiProperty } from '@nestjs/swagger';

export class BalanceSheetItemDto {
  @ApiProperty({ description: 'Account number' })
  accountNumber: string;

  @ApiProperty({ description: 'Account name' })
  accountName: string;

  @ApiProperty({ description: 'Account balance' })
  balance: number;

  @ApiProperty({ description: 'Account type' })
  accountType: string;
}

export class BalanceSheetDto {
  @ApiProperty({ description: 'Assets', type: [BalanceSheetItemDto] })
  assets: BalanceSheetItemDto[];

  @ApiProperty({ description: 'Liabilities', type: [BalanceSheetItemDto] })
  liabilities: BalanceSheetItemDto[];

  @ApiProperty({ description: 'Equity', type: [BalanceSheetItemDto] })
  equity: BalanceSheetItemDto[];

  @ApiProperty({ description: 'Total assets' })
  totalAssets: number;

  @ApiProperty({ description: 'Total liabilities' })
  totalLiabilities: number;

  @ApiProperty({ description: 'Total equity' })
  totalEquity: number;
}
