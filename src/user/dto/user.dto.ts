import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../roles/roles.enum';
import { Language } from '../enums/language.enum';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @Type(() => String)
  _id: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty()
  email: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty()
  display_name: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({ required: false })
  country_code?: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({ required: false, enum: Language })
  native_language_id?: Language;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({ required: false, enum: Language })
  ui_language_id?: Language;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({ enum: UserRole, required: true })
  role: UserRole;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'Profile image as base64 string',
  })
  profile_image_buffer?: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  createdAt: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  updatedAt: string;

  @Exclude()
  password_hash: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) =>
    Array.isArray(obj.refreshToken) ? undefined : obj.refreshToken,
  )
  refreshToken: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  accessToken: string;
}
