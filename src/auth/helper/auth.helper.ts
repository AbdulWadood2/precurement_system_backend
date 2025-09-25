import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthHelper } from '../interface/auth.helper.interface';
import { UserRole } from 'src/user/roles/roles.enum';
import { DecodedJwtToken } from '../dto/decodedToken.dto';
import { IEncryptionService } from 'src/encryption/interface/encryption.interface.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthHelper implements IAuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IEncryptionService')
    private readonly encryptionService: IEncryptionService,
  ) {}

  // Generate Unique Id
  async generateUniqueId(namespace: string): Promise<string> {
    const { v4: uuidv4 } = await import('uuid'); // Dynamic import for uuid
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomString = uuidv4(); // Generate a UUID
    return `${namespace}-${timestamp}-${randomString}`;
  }

  // Generate Token
  async generateTokens(payload: {
    userId: string;
    role: UserRole;
    email: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // generate otp
    const uniqueId = this.generateUniqueId('default');
    const accessToken = this.jwtService.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        uniqueId,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_AccessTokenExpiry,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        uniqueId,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_RefreshTokenExpiry,
      },
    );

    return { accessToken, refreshToken };
  }

  // Decode Token
  async decodeToken(token: string): Promise<DecodedJwtToken> {
    try {
      return await this.jwtService.verifyAsync<DecodedJwtToken>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Method to validate password on login
  validatePassword(plainPassword: string, storedPassword: string): boolean {
    const decryptedPassword = this.encryptionService.decrypt(storedPassword);
    return plainPassword === decryptedPassword;
  }

  // Generate OTP
  generateOtp(): number {
    const digits = 6;
    if (digits <= 0) {
      throw new Error('Number of digits must be greater than 0');
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  }
}
