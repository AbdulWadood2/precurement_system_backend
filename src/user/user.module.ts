import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserHelper } from './helper/user.helper';
import { User, UserSchema } from './schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => EncryptionModule),
  ],
  controllers: [UserController],
  providers: [
    { provide: 'IUserService', useClass: UserService },
    { provide: 'IUserHelper', useClass: UserHelper },
  ],
  exports: [
    { provide: 'IUserService', useClass: UserService },
    { provide: 'IUserHelper', useClass: UserHelper },
  ],
})
export class UserModule {}
