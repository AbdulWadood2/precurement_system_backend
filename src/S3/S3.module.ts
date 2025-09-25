import { Module } from '@nestjs/common';
import { S3Service } from './S3.service';
import { S3Controller } from './S3.controller';

@Module({
  controllers: [S3Controller],
  providers: [{ provide: 'IS3Service', useClass: S3Service }],
  exports: [{ provide: 'IS3Service', useClass: S3Service }],
})
export class S3Module {}
