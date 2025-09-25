import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthHelper } from './helper/auth.helper';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    EncryptionModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
  ],
})
export class AuthModule {}
