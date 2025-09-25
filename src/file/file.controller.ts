import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IFileService } from './interfaces/file.services.interface';
import { memoryStorage } from 'multer';

// Unified multer configuration for both images and videos
const unifiedMulterConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB per file
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    // Allow both images and videos
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'video/quicktime', // iOS QuickTime format
      'video/x-msvideo', // AVI alternative
      'video/x-ms-wmv', // WMV alternative
      'video/x-flv', // FLV alternative
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequestException(`File type ${file.mimetype} not allowed`), false);
    }
  },
};

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(
    @Inject('IFileService') private readonly fileService: IFileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, unifiedMulterConfig))
  @ApiOperation({ 
    summary: 'Upload multiple media files (images/videos) to S3 Storage',
    description: 'Upload images (JPEG, PNG, GIF, WebP) or videos (MP4, AVI, MOV, WMV, FLV, WebM). Max 200MB per file.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload images (JPEG, PNG, GIF, WebP) or videos (MP4, AVI, MOV, WMV, FLV, WebM). Max 200MB per file.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid file type' })
  @ApiResponse({
    status: 413,
    description: 'File too large (max 200MB per file)',
  })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ data: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate file sizes and types
    for (const file of files) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        throw new BadRequestException(`File ${file.originalname} is too large. Maximum size is 200MB.`);
      }
    }

    // Use streaming upload for memory efficiency
    const fileNames = await this.fileService.uploadMultipleFiles(files);
    return { data: fileNames };
  }

  // Keep the old endpoint for backward compatibility
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10, unifiedMulterConfig))
  @ApiOperation({ 
    summary: 'Upload multiple media files (images/videos) to S3 Storage - Legacy endpoint',
    description: 'Upload images (JPEG, PNG, GIF, WebP) or videos (MP4, AVI, MOV, WMV, FLV, WebM). Max 200MB per file. This endpoint is maintained for backward compatibility.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload images (JPEG, PNG, GIF, WebP) or videos (MP4, AVI, MOV, WMV, FLV, WebM). Max 200MB per file.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid file type' })
  @ApiResponse({
    status: 413,
    description: 'File too large (max 200MB per file)',
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ data: string[] }> {
    // Delegate to the main upload method
    return this.uploadFiles(files);
  }
}
