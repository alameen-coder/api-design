import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
    });
    return bookmarks;
  }

  async createBookmark(userId: number, createBookmark: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...createBookmark,
      },
    });
    return bookmark;
  }

  async findOne(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId, userId },
    });
    if (bookmark?.userId !== userId) {
      throw new ForbiddenException(
        `Bookmark is not available for user ${userId}`,
      );
    }
    return bookmark;
  }

  async updateBookmark(
    userId: number,
    updateBookmark: UpdateBookmarkDto,
    bookmarkId: number,
  ) {
    try {
      const bookmark = await this.prisma.bookmark.update({
        where: { id: bookmarkId },
        data: updateBookmark,
      });
      if (bookmark?.userId !== userId) {
        throw new ForbiddenException(
          `This bookmark is not available for user ${userId}`,
        );
      }
      return bookmark;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException(
            `This bookmark is not available for user ${userId}`,
          );
        }
        throw error;
      }
    }
  }

  async delete(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (bookmark?.userId !== userId) {
      throw new ForbiddenException(
        `This bookmark is not available for user ${userId}`,
      );
    }
    this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return {
      status: 201,
      msg: 'Bookmark deleted successfully',
    };
  }
}
