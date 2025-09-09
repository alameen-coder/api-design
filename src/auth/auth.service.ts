import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // generate hashed password
    const hash = await argon2.hash(dto.password);
    try {
      // save the user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashpassword: hash,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashpassword, ...userWithoutPassword } = user; // remove the password hash from the response
      // return the saved user
      const token = await this.signToken(user.id, user.email);
      return {
        msg: 'Registration Successful',
        statusCode: 201,
        user: userWithoutPassword,
        access_token: token,
      };
    } catch (error) {
      // console.error('Signup error:', error);

      // Handle Prisma unique constraint violation
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.code === 'P2002' ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        error.message?.includes('Unique constraint')
      ) {
        throw new ForbiddenException('Credentials taken');
      }

      // Re-throw any other errors
      throw error;
    }
  }

  async login(
    dto: AuthDto,
  ): Promise<{ msg: string; statusCode: number; access_token: string }> {
    // find if an email is the db
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // confirm the user exists and password is correct
    if (!user || !(await argon2.verify(user.hashpassword, dto.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.signToken(user.id, user.email);
    return {
      msg: 'Login Successful',
      statusCode: 200,
      access_token: token,
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email: email };
    // sign the token

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN'),
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return token;
  }
}
