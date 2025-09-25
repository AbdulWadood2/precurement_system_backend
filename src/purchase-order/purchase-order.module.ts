import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PurchaseOrder,
  PurchaseOrderSchema,
} from './schema/purchase-order.schema';
import { PurchaseOrderHelper } from './helper/purchase-order.helper';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchaseOrder.name, schema: PurchaseOrderSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    { provide: 'IPurchaseOrderHelper', useClass: PurchaseOrderHelper },
    { provide: 'IPurchaseOrderService', useClass: PurchaseOrderService },
  ],
  controllers: [PurchaseOrderController],
  exports: [
    { provide: 'IPurchaseOrderService', useClass: PurchaseOrderService },
  ],
})
export class PurchaseOrderModule {}
