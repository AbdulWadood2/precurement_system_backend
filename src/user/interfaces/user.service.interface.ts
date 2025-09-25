import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserRole } from '../roles/roles.enum';

export interface IUserService {
  findById(id: string): Promise<UserDto>;
  updateProfile(id: string, updateData: any): Promise<UserDto>;
  findAll(role?: UserRole): Promise<UserDto[]>;
  createUser(dto: CreateUserDto): Promise<UserDto>;
  updateUser(id: string, dto: UpdateUserDto): Promise<UserDto>;
  changePassword(id: string, dto: ChangePasswordDto): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;
  searchUsers(
    query?: string,
    role?: UserRole,
    limit?: number,
  ): Promise<UserDto[]>;
}
