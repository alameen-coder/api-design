import { Injectable } from '@nestjs/common';
import { PrismaService} from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor( private readonly prisma:  PrismaService) {}
  signup() {
    return { msg: 'You have signed up' };
  }
  login() {
    return { msg: 'you have logined up' };
  }
}
