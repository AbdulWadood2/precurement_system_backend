import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { UserDto } from 'src/user/dto/user.dto';
import { IUserHelper } from 'src/user/interfaces/user.helper.interface';
import { LoginDto } from './dto/login.dto';
import { IAuthHelper } from './interface/auth.helper.interface';
import { RegisterDto } from './dto/register.dto';
import { logAndThrowError } from 'src/utils/errors/error.utils';
import mongoose from 'mongoose';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserHelper') private userHelper: IUserHelper,
    @Inject('IAuthHelper') private authHelper: IAuthHelper,
  ) {}

  async login(dto: LoginDto): Promise<UserDto> {
    try {
      const user = await this.userHelper.validateUser(dto.email, dto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { refreshToken, accessToken } =
        await this.authHelper.generateTokens({
          userId: user._id,
          role: user.role,
          email: user.email,
        });
      await this.userHelper.pushRefreshToken({
        _id: user._id,
        refreshToken,
      });
      return {
        ...user,
        refreshToken,
        accessToken,
      };
    } catch (error) {
      throw logAndThrowError('error in login', error);
    }
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    try {
      // is email already exists
      const userExist = await this.userHelper.findByEmail(dto.email);
      if (userExist) {
        throw new BadRequestException('Email already exists');
      }
      const user = await this.userHelper.createUser(dto);
      const { refreshToken, accessToken } =
        await this.authHelper.generateTokens({
          userId: user._id,
          role: user.role,
          email: user.email,
        });
      await this.userHelper.pushRefreshToken({
        _id: user._id,
        refreshToken,
      });
      return {
        ...user,
        refreshToken,
        accessToken,
      };
    } catch (error) {
      throw logAndThrowError('error in register', error);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const decoded = await this.authHelper.decodeToken(refreshToken);

      // Find the user with the decoded userId
      const user = await this.userHelper.findById(decoded.userId);
      if (!user || !user.refreshToken.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.userHelper.removeRefreshToken({
        _id: String(user._id),
        refreshToken,
      });

      return;
    } catch (error) {
      throw logAndThrowError('error in logout', error);
    }
  }

  // refreshToken
  async refreshToken(
    refreshToken: string,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    try {
      // Validate refresh token format
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new UnauthorizedException('Invalid refresh token format');
      }

      // Decode refresh token
      let decoded;
      try {
        decoded = await this.authHelper.decodeToken(refreshToken);
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Find user
      const user = await this.userHelper.findById(
        decoded.userId.toString(),
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Validate that the refresh token exists in user's refresh tokens
      if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userId = user._id as string;

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authHelper.generateTokens({
          userId,
          role: user.role,
          email: user.email,
        });

      // Remove old refresh token and add new one atomically
      await Promise.all([
        this.userHelper.removeRefreshToken({ _id: userId, refreshToken }),
        this.userHelper.pushRefreshToken({
          _id: userId,
          refreshToken: newRefreshToken,
        }),
      ]);

      // Log successful refresh for monitoring
      console.log(`Refresh token renewed for user: ${userId}`);

      return { data: { accessToken, refreshToken: newRefreshToken } };
    } catch (error) {
      throw logAndThrowError('error in refreshToken', error);
    }
  }
}
