import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
          throw new BadRequestException(
            'Please provide MONGODB_URL in environment variables',
          );
        }
        return {
          uri: mongoUrl,
        };
      },
    }),
    UserModule,
    AuthModule,
    EncryptionModule,
    FileModule
  ],
})
export class AppModule {}
