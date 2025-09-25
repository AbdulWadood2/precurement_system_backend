import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../roles/roles.enum';
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
  @ApiProperty({ required: false })
  native_language_id?: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  @ApiProperty({ required: false })
  ui_language_id?: string;

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
  @ApiProperty({ required: false })
  profile_image_buffer?: Buffer;

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
