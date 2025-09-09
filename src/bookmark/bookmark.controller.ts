import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // Define your endpoints here
  //GET /bookmark
  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.bookmarkService.findAll(userId);
  }

  //GET /bookmark/:id
  @Get(':id')
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.findOne(userId, bookmarkId);
  }

  //POST /bookmark/create
  @Post('create')
  createBookmark(
    @GetUser('id') userId: number,
    @Body() createBookmark: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, createBookmark);
  }

  //PATCH /bookmark/:id
  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() updateBookmark: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(
      userId,
      updateBookmark,
      bookmarkId,
    );
  }

  //DELETE /bookmark/:id
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.delete(userId, bookmarkId);
  }
}
