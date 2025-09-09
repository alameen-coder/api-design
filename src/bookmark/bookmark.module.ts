import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService],
})
export class BookmarkModule {}
