import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserHelper } from '../interfaces/user.helper.interface';
import { User } from '../schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
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

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...dto };

    // If password is provided, encrypt it
    if (dto.password) {
      updateData.password_hash = await this.encryptionService.encrypt(
        dto.password,
      );
      delete updateData.password;
    }

    const result = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!result) {
      throw new Error('User not found');
    }
    return result;
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
}
