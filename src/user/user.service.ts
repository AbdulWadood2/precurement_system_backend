import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserService } from './interfaces/user.service.interface';
import { IUserHelper } from './interfaces/user.helper.interface';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserFormDto } from './dto/update-user-form.dto';
import { UpdateProfileFormDto } from './dto/update-profile-form.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileImageResponseDto } from './dto/upload-profile-image.dto';
import { plainToInstance } from 'class-transformer';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import { UserRole } from './roles/roles.enum';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject('IUserHelper') private readonly helper: IUserHelper) {}

  async findById(id: string): Promise<UserDto> {
    try {
      const user = await this.helper.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
    } catch (error) {
      throw logAndThrowError('User not found', error);
    }
  }

  async updateProfile(id: string, updateData: any): Promise<UserDto> {
    try {
      const user = await this.helper.updateProfile(id, updateData);
      return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
    } catch (error) {
      throw logAndThrowError('User not found', error);
    }
  }

  async findAll(role?: UserRole): Promise<UserDto[]> {
    try {
      const users = await this.helper.findAll(role);
      return users.map((user) =>
        plainToInstance(UserDto, JSON.parse(JSON.stringify(user))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to fetch users', error);
    }
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    try {
      const user = await this.helper.createUser(dto);
      return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
    } catch (error) {
      throw logAndThrowError('Failed to create user', error);
    }
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<UserDto> {
    try {
      const user = await this.helper.changePassword(id, dto);
      return plainToInstance(UserDto, JSON.parse(JSON.stringify(user)));
    } catch (error) {
      throw logAndThrowError('Failed to change password', error);
    }
  }

  async searchUsers(
    query?: string,
    role?: UserRole,
    limit?: number,
  ): Promise<UserDto[]> {
    try {
      const users = await this.helper.searchUsers(query, role, limit);
      return users.map((user) =>
        plainToInstance(UserDto, JSON.parse(JSON.stringify(user))),
      );
    } catch (error) {
      throw logAndThrowError('Failed to search users', error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.helper.deleteUser(id);
    } catch (error) {
      throw logAndThrowError('Failed to delete user', error);
    }
  }

  async uploadProfileImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<ProfileImageResponseDto> {
    try {
      return await this.helper.uploadProfileImage(id, file);
    } catch (error) {
      throw logAndThrowError('Failed to upload profile image', error);
    }
  }

  async updateUserWithForm(
    id: string,
    dto: UpdateUserFormDto,
  ): Promise<UserDto> {
    try {
      return await this.helper.updateUserWithForm(id, dto);
    } catch (error) {
      throw logAndThrowError('Failed to update user with form data', error);
    }
  }

  async updateProfileWithForm(
    id: string,
    dto: UpdateProfileFormDto,
  ): Promise<UserDto> {
    try {
      return await this.helper.updateProfileWithForm(id, dto);
    } catch (error) {
      throw logAndThrowError('Failed to update profile with form data', error);
    }
  }
}
