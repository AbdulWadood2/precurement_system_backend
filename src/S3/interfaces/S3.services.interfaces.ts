import { Readable } from 'stream';

export interface IS3Service {
  uploadFile(file: Express.Multer.File): Promise<string>;
  getSignedUrl(fileName: string): Promise<string | null>;
  doesFileExist(fileName: string): Promise<boolean>;
  uploadFileStream(fileStream: Readable, fileName: string, contentType: string): Promise<string>;
  getFileNameFromUrl(url: string): Promise<string | null>;
}
