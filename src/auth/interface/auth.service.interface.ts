import { LoginDto } from '../dto/login.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { RegisterDto } from '../dto/register.dto';

export interface IAuthService {
  login(user: LoginDto): Promise<UserDto>;
  register(dto: RegisterDto): Promise<UserDto>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ data: { accessToken: string; refreshToken: string } }>;
}
