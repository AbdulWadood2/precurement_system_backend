import { Module } from '@nestjs/common';
import { GeneralLedgerController } from './general-ledger.controller';
import { GeneralLedgerService } from './general-ledger.service';
import { GeneralLedgerHelper } from './helper/general-ledger.helper';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeneralLedger,
  GeneralLedgerSchema,
} from './schema/general-ledger.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeneralLedger.name, schema: GeneralLedgerSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [GeneralLedgerController],
  providers: [
    { provide: 'IGeneralLedgerService', useClass: GeneralLedgerService },
    { provide: 'IGeneralLedgerHelper', useClass: GeneralLedgerHelper },
  ],
  exports: [
    { provide: 'IGeneralLedgerService', useClass: GeneralLedgerService },
    { provide: 'IGeneralLedgerHelper', useClass: GeneralLedgerHelper },
  ],
})
export class GeneralLedgerModule {}
