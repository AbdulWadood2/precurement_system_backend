import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardHelper } from './helper/dashboard.helper';
import { UserModule } from '../user/user.module';
import { PurchaseRequestModule } from '../purchase-request/purchase-request.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ReceivingModule } from '../receiving/receiving.module';
import { PaymentVoucherModule } from '../payment-voucher/payment-voucher.module';
import { ChartOfAccountsModule } from '../chart-of-accounts/chart-of-accounts.module';
import { JournalEntryModule } from '../journal-entry/journal-entry.module';
import { GeneralLedgerModule } from '../general-ledger/general-ledger.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PurchaseRequestModule,
    PurchaseOrderModule,
    InvoiceModule,
    ReceivingModule,
    PaymentVoucherModule,
    ChartOfAccountsModule,
    JournalEntryModule,
    GeneralLedgerModule,
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'IDashboardService',
      useClass: DashboardService,
    },
    {
      provide: 'IDashboardHelper',
      useClass: DashboardHelper,
    },
    DashboardService,
    DashboardHelper,
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
