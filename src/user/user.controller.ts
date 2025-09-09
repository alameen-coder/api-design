import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as client from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateEditUser } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // PATCH /user/update
  @Patch('update')
  updateProfile(
    @GetUser() user: client.User,
    @Body() updateData: UpdateEditUser,
  ) {
    return this.userService.update(user.id, updateData);
  }

  //DELETE /user/delete
  @Delete('delete')
  deleteUser(@GetUser() user: client.User) {
    return this.userService.delete(user.id);
  }

  //GET /user/profile
  @Get('profile')
  getProfile(@GetUser() user: client.User) {
    return user;
  }
}
