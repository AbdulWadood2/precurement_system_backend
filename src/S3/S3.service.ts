// src/s3/s3.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Readable } from 'stream';
import { IS3Service } from './interfaces/S3.services.interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class S3Service implements IS3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor() {
    // Set uploads directory (default to ./uploads)
    this.uploadsDir =
      process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    // Ensure uploads directory exists
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory(): void {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
        this.logger.log(`Created uploads directory: ${this.uploadsDir}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create uploads directory: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to initialize file storage',
      );
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(this.uploadsDir, fileName);

    try {
      await promisify(fs.writeFile)(filePath, file.buffer);
      this.logger.log(`File uploaded successfully: ${fileName}`);
      return fileName;
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getSignedUrl(fileName: string): Promise<string | null> {
    if (!fileName) return null;

    try {
      const filePath = path.join(this.uploadsDir, fileName);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`File not found: ${fileName}`);
        return null;
      }

      // Return direct URL to the file
      return `${this.baseUrl}/uploads/${fileName}`;
    } catch (err) {
      this.logger.error(`Error generating file URL: ${err.message}`);
      throw new InternalServerErrorException('Failed to generate file URL');
    }
  }

  async doesFileExist(fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      return fs.existsSync(filePath);
    } catch (err) {
      this.logger.error(`Error checking file existence: ${err.message}`);
      return false;
    }
  }

  // Stream upload for large files
  async uploadFileStream(
    fileStream: Readable,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const filePath = path.join(this.uploadsDir, fileName);

    try {
      const writeStream = fs.createWriteStream(filePath);

      return new Promise((resolve, reject) => {
        fileStream.pipe(writeStream);

        writeStream.on('finish', () => {
          this.logger.log(`Stream upload completed: ${fileName}`);
          resolve(fileName);
        });

        writeStream.on('error', (err) => {
          this.logger.error(`Stream upload error: ${err.message}`);
          reject(
            new InternalServerErrorException('Failed to upload file stream'),
          );
        });

        fileStream.on('error', (err) => {
          this.logger.error(`File stream error: ${err.message}`);
          reject(new InternalServerErrorException('File stream error'));
        });
      });
    } catch (err) {
      this.logger.error(`Error in stream upload: ${err.message}`);
      throw new InternalServerErrorException('Failed to upload file stream');
    }
  }

  async getFileNameFromUrl(url: string): Promise<string | null> {
    try {
      if (!url) return null;

      // Remove query params
      const cleanUrl = url.split('?')[0];

      // Split by '/' and get last part
      const parts = cleanUrl.split('/');
      const fileName = parts[parts.length - 1];

      return fileName || null;
    } catch (error) {
      this.logger.error(`Error extracting filename from URL: ${error.message}`);
      return null;
    }
  }
}
