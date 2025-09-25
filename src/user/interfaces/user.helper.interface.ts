import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '../schema/user.schema';
import { UserRole } from '../roles/roles.enum';

export interface IUserHelper {
  createUser(dto: RegisterDto | CreateUserDto): Promise<UserDto>;
  validateUser(email: string, password: string): Promise<UserDto | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(role?: UserRole): Promise<User[]>;
  searchUsers(query?: string, role?: UserRole, limit?: number): Promise<User[]>;
  updateProfile(id: string, updateData: any): Promise<User>;
  updateUser(id: string, dto: UpdateUserDto): Promise<User>;
  changePassword(id: string, dto: ChangePasswordDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  pushRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null>;
  removeRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null>;
  findUserWithDto(id: string): Promise<UserDto | null>;
}
