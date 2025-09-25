import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { S3Module } from 'src/S3/S3.module';

@Module({
  imports: [S3Module],
  controllers: [FileController],
  providers: [{ provide: 'IFileService', useClass: FileService }],
})
export class FileModule {}
