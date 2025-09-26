import { ApiProperty } from '@nestjs/swagger';
import { ChartOfAccountsDto } from './chart-of-accounts.dto';

export class AccountHierarchyDto extends ChartOfAccountsDto {
  @ApiProperty({
    description: 'Child accounts',
    type: [ChartOfAccountsDto],
  })
  children: AccountHierarchyDto[];
}
