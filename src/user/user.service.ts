import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEditUser } from './dto';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, data: UpdateEditUser) {
    const updateUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { hashpassword, ...user } = updateUser;

    return {
      msg: `User update Successfully`,
      user,
    };
  }

  async delete(userId: number) {
    const deleteUser = await this.prisma.user.delete({
      where: { id: userId },
    });

    const { hashpassword, ...user } = deleteUser;
    if (!user) {
      throw new HttpException(
        `User with ID ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      msg: `User with ID ${userId} deleted successfully`,
      user,
    };
  }
}
