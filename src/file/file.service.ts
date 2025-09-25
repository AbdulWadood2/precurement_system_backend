import { Inject, Injectable } from '@nestjs/common';
import { IS3Service } from 'src/S3/interfaces/S3.services.interfaces';
import { IFileService } from './interfaces/file.services.interface';
import { Readable, PassThrough } from 'stream';

@Injectable()
export class FileService implements IFileService {
  constructor(
    @Inject('IS3Service')
    private readonly S3Service: IS3Service,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log(file);

    // Create a stream from the buffer for memory efficiency
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileStream = new PassThrough();

    // Write buffer to stream in chunks to avoid memory spikes
    const chunkSize = 1024 * 1024; // 1MB chunks
    const buffer = file.buffer;

    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      fileStream.write(chunk);
    }
    fileStream.end();

    return this.S3Service.uploadFileStream(fileStream, fileName, file.mimetype);
  }

  /**
   * Upload multiple files using streaming for memory efficiency
   */
  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      const fileStream = new PassThrough();

      // Write buffer to stream in chunks
      const chunkSize = 1024 * 1024; // 1MB chunks
      const buffer = file.buffer;

      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        fileStream.write(chunk);
      }
      fileStream.end();

      return this.S3Service.uploadFileStream(
        fileStream,
        fileName,
        file.mimetype,
      );
    });

    return Promise.all(uploadPromises);
  }
}
