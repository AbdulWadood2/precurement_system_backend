import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Inject,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IAuthService } from './interface/auth.service.interface';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/user/roles/roles.enum';
import { Roles } from './decorator/roles.decorator';
import { LogoutDto } from './dto/logout-user.dto';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('IAuthService') private authService: IAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login (Public)' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto): Promise<{
    data: UserDto;
  }> {
    const user = await this.authService.login(dto);
    return {
      data: user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration (Public)' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<{
    data: UserDto;
  }> {
    const user = await this.authService.register(registerDto);
    return {
      data: user,
    };
  }

  @ApiOperation({ summary: 'Logout user by invalidating refresh token (All authenticated users)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.ADMIN, UserRole.MANAGER, UserRole.OWNER)
  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<{ data: string }> {
    await this.authService.logout(logoutDto.refreshToken);
    return { data: 'logout successfully' };
  }

  @ApiOperation({ summary: 'Refresh the access token using the refresh token (All authenticated users)' })
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @Post('refresh-token')
  async refreshToken(
    @Request() request: any,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    // Get the token from the Authorization header
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    return this.authService.refreshToken(token); // Call the service with the token
  }

  @ApiOperation({ summary: 'Verify if the access token is valid (All authenticated users)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(
    @Request() request: any,
  ): Promise<{ data: { valid: boolean } }> {
    // If we reach here, the token is valid (AuthGuard validates it)
    return { data: { valid: true } };
  }
}
