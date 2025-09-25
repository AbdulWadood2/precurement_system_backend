import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PurchaseRequest,
  PurchaseRequestSchema,
} from './schema/purchase-request.schema';
import { PurchaseRequestHelper } from './helper/purchase-request.helper';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequestController } from './purchase-request.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchaseRequest.name, schema: PurchaseRequestSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    { provide: 'IPurchaseRequestHelper', useClass: PurchaseRequestHelper },
    { provide: 'IPurchaseRequestService', useClass: PurchaseRequestService },
  ],
  controllers: [PurchaseRequestController],
  exports: [
    { provide: 'IPurchaseRequestService', useClass: PurchaseRequestService },
  ],
})
export class PurchaseRequestModule {}
