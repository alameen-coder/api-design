import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.test'], // Loads .env.test if NODE_ENV is set to 'test'
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    UserModule,
    AuthModule,
    BookmarkModule,
    PrismaModule,
  ],
})
export class AppModule {}
