import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserFormDto } from '../dto/update-user-form.dto';
import { UpdateProfileFormDto } from '../dto/update-profile-form.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ProfileImageResponseDto } from '../dto/upload-profile-image.dto';
import { UserRole } from '../roles/roles.enum';

export interface IUserService {
  findById(id: string): Promise<UserDto>;
  updateProfile(id: string, updateData: any): Promise<UserDto>;
  findAll(role?: UserRole): Promise<UserDto[]>;
  createUser(dto: CreateUserDto): Promise<UserDto>;
  updateUserWithForm(id: string, dto: UpdateUserFormDto): Promise<UserDto>;
  updateProfileWithForm(id: string, dto: UpdateProfileFormDto): Promise<UserDto>;
  changePassword(id: string, dto: ChangePasswordDto): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;
  searchUsers(
    query?: string,
    role?: UserRole,
    limit?: number,
  ): Promise<UserDto[]>;
  uploadProfileImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<ProfileImageResponseDto>;
  updateUserWithForm(id: string, dto: UpdateUserFormDto): Promise<UserDto>;
}
