import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Receiving, ReceivingSchema } from './schema/receiving.schema';
import { ReceivingHelper } from './helper/receiving.helper';
import { ReceivingService } from './receiving.service';
import { ReceivingController } from './receiving.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Receiving.name, schema: ReceivingSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    { provide: 'IReceivingHelper', useClass: ReceivingHelper },
    { provide: 'IReceivingService', useClass: ReceivingService },
  ],
  controllers: [ReceivingController],
  exports: [
    { provide: 'IReceivingHelper', useClass: ReceivingHelper },
    { provide: 'IReceivingService', useClass: ReceivingService },
  ],
})
export class ReceivingModule {}
