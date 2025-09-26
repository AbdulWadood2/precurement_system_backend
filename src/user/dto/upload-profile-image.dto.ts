import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadProfileImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile image file (JPEG, PNG, GIF)',
    required: true,
  })
  profile_image: Express.Multer.File;
}

export class ProfileImageResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Profile image uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Profile image URL or base64 data',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
  })
  profile_image_url: string;
}
