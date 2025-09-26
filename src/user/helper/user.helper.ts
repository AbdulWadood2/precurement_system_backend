import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserHelper } from '../interfaces/user.helper.interface';
import { User } from '../schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserFormDto } from '../dto/update-user-form.dto';
import { UpdateProfileFormDto } from '../dto/update-profile-form.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ProfileImageResponseDto } from '../dto/upload-profile-image.dto';
import { IEncryptionService } from 'src/encryption/interface/encryption.interface.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserRole } from '../roles/roles.enum';

@Injectable()
export class UserHelper implements IUserHelper {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('IEncryptionService') private encryptionService: IEncryptionService,
  ) {}

  async createUser(dto: RegisterDto | CreateUserDto): Promise<UserDto> {
    const password_hash = await this.encryptionService.encrypt(dto.password);

    // Check if it's CreateUserDto (has role property) or RegisterDto (doesn't have role)
    const isCreateUserDto = 'role' in dto;

    const userData: any = {
      email: dto.email,
      password_hash,
      display_name: dto.display_name,
    };

    // Add additional fields if it's CreateUserDto
    if (isCreateUserDto) {
      const createDto = dto as CreateUserDto;
      userData.role = createDto.role;
      userData.country_code = createDto.country_code;
      userData.native_language_id = createDto.native_language_id;
      userData.ui_language_id = createDto.ui_language_id;
    }

    const user = await this.userModel.create(userData);
    return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await this.comparePassword(password, user.password_hash))) {
      return plainToInstance(UserDto, user.toObject());
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateProfile(id: string, updateData: any): Promise<User> {
    const result = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!result) {
      throw new Error('User not found');
    }
    return result;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return this.encryptionService.decrypt(hash) === password;
  }

  // Push Refresh Token
  async pushRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: payload._id },
      { $push: { refreshToken: payload.refreshToken } },
      { new: true },
    );
    return updatedUser;
  }

  // Remove Refresh Token
  async removeRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: payload._id },
      { $pull: { refreshToken: payload.refreshToken } },
      { new: true },
    );
    return updatedUser;
  }

  async findUserWithDto(id: string): Promise<UserDto | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
  }

  async findAll(role?: UserRole): Promise<User[]> {
    const query = role ? { role } : {};
    return this.userModel.find(query).exec();
  }

  async searchUsers(
    query?: string,
    role?: UserRole,
    limit?: number,
  ): Promise<User[]> {
    let searchQuery: any = {};

    // Add role filter if provided
    if (role) {
      searchQuery.role = role;
    }

    // Add text search if query is provided
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      searchQuery.$or = [{ display_name: searchRegex }, { email: searchRegex }];
    }

    let mongoQuery = this.userModel.find(searchQuery);

    // Add limit if provided
    if (limit && limit > 0) {
      mongoQuery = mongoQuery.limit(limit);
    }

    return mongoQuery.exec();
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(
      dto.currentPassword,
      user.password_hash,
    );
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Encrypt new password
    const newPasswordHash = await this.encryptionService.encrypt(
      dto.newPassword,
    );

    // Update password
    const result = await this.userModel
      .findByIdAndUpdate(id, { password_hash: newPasswordHash }, { new: true })
      .exec();

    if (!result) {
      throw new Error('Failed to update password');
    }

    return result;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('User not found');
    }
  }

  async uploadProfileImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<ProfileImageResponseDto> {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Convert file buffer to base64
    const base64Image = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    const profileImageUrl = `data:${mimeType};base64,${base64Image}`;

    // Update user profile image
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { profile_image_buffer: file.buffer },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      message: 'Profile image uploaded successfully',
      profile_image_url: profileImageUrl,
    };
  }

  async updateUserWithForm(
    id: string,
    dto: UpdateUserFormDto,
  ): Promise<UserDto> {
    const updateData: any = {};

    // Handle regular fields
    if (dto.email) updateData.email = dto.email;
    if (dto.display_name) updateData.display_name = dto.display_name;
    if (dto.role) updateData.role = dto.role;
    if (dto.country_code) updateData.country_code = dto.country_code;
    if (dto.native_language_id)
      updateData.native_language_id = dto.native_language_id;
    if (dto.ui_language_id) updateData.ui_language_id = dto.ui_language_id;

    // Handle password if provided
    if (dto.password) {
      updateData.password_hash = await this.encryptionService.encrypt(
        dto.password,
      );
    }

    // Handle profile image if provided
    if (dto.profile_image) {
      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(dto.profile_image.mimetype)) {
        throw new Error(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (dto.profile_image.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      updateData.profile_image_buffer = dto.profile_image.buffer;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return plainToInstance(UserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateProfileWithForm(
    id: string,
    dto: UpdateProfileFormDto,
  ): Promise<UserDto> {
    const updateData: any = {};

    // Handle regular fields
    if (dto.display_name) updateData.display_name = dto.display_name;
    if (dto.country_code) updateData.country_code = dto.country_code;
    if (dto.native_language_id)
      updateData.native_language_id = dto.native_language_id;
    if (dto.ui_language_id) updateData.ui_language_id = dto.ui_language_id;

    // Handle profile image if provided
    if (dto.profile_image) {
      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(dto.profile_image.mimetype)) {
        throw new Error(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (dto.profile_image.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      updateData.profile_image_buffer = dto.profile_image.buffer;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return plainToInstance(UserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
