import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Module({
  providers: [{ provide: 'IEncryptionService', useClass: EncryptionService }],
  exports: [{ provide: 'IEncryptionService', useClass: EncryptionService }],
})
export class EncryptionModule {}
