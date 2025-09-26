import { Module } from '@nestjs/common';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { ChartOfAccountsHelper } from './helper/chart-of-accounts.helper';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChartOfAccounts,
  ChartOfAccountsSchema,
} from './schema/chart-of-accounts.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChartOfAccounts.name, schema: ChartOfAccountsSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [ChartOfAccountsController],
  providers: [
    { provide: 'IChartOfAccountsService', useClass: ChartOfAccountsService },
    { provide: 'IChartOfAccountsHelper', useClass: ChartOfAccountsHelper },
  ],
  exports: [
    { provide: 'IChartOfAccountsService', useClass: ChartOfAccountsService },
    { provide: 'IChartOfAccountsHelper', useClass: ChartOfAccountsHelper },
  ],
})
export class ChartOfAccountsModule {}
