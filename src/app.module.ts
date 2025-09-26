import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { ReceivingModule } from './receiving/receiving.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentVoucherModule } from './payment-voucher/payment-voucher.module';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { ChartOfAccountsModule } from './chart-of-accounts/chart-of-accounts.module';
import { JournalEntryModule } from './journal-entry/journal-entry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
          throw new BadRequestException(
            'Please provide MONGODB_URL in environment variables',
          );
        }
        return {
          uri: mongoUrl,
        };
      },
    }),
    UserModule,
    AuthModule,
    EncryptionModule,
    PurchaseRequestModule,
    PurchaseOrderModule,
    ReceivingModule,
    InvoiceModule,
    PaymentVoucherModule,
    GeneralLedgerModule,
    ChartOfAccountsModule,
    JournalEntryModule,
  ],
})
export class AppModule {}
