import { Module } from '@nestjs/common';
import { PaymentVoucherController } from './payment-voucher.controller';
import { PaymentVoucherService } from './payment-voucher.service';
import { PaymentVoucherHelper } from './helper/payment-voucher.helper';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentVoucher,
  PaymentVoucherSchema,
} from './schema/payment-voucher.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentVoucher.name, schema: PaymentVoucherSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [PaymentVoucherController],
  providers: [
    { provide: 'IPaymentVoucherService', useClass: PaymentVoucherService },
    { provide: 'IPaymentVoucherHelper', useClass: PaymentVoucherHelper },
  ],
  exports: [
    { provide: 'IPaymentVoucherService', useClass: PaymentVoucherService },
    { provide: 'IPaymentVoucherHelper', useClass: PaymentVoucherHelper },
  ],
})
export class PaymentVoucherModule {}
