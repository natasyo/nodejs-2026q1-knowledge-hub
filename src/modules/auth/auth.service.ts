import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async login(userDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        login: userDto.login,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isValidPassword = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, login: userDto.login };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET as string,
      }),
    };
  }

  // async signup(userDto: SignupDto) {
  //   const user = await this.prismaService.user.findFirst({
  //     where: { login: userDto.login },
  //   });
  //   if (!user) {
  //     const passHash = await bcrypt.hash(userDto.password, 12);
  //     return this.prismaService.user.create({
  //       data: {
  //         login: userDto.login,
  //         password: passHash,
  //       },
  //       select: {
  //         login: true,
  //         id: true,
  //         role: true,
  //         updatedAt: true,
  //         createdAt: true,
  //       },
  //     });
  //   } else {
  //     const isValidPassword = await bcrypt.compare(
  //       userDto.password,
  //       user.password,
  //     );
  //     if (!isValidPassword) {
  //       throw new UnauthorizedException();
  //     }
  //     return user;
  //   }
  // }

  async signup(user: SignupDto) {
    try {
      const passHash = await bcrypt.hash(user.password, 12);
      return await this.prismaService.user.create({
        data: {
          login: user.login,
          password: passHash,
        },
        select: {
          login: true,
          id: true,
          role: true,
          updatedAt: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        this.logger.error(`Login ${user.login} exists`);
        throw new BadRequestException(`Login ${user.login} exists`);
      }
      this.logger.error((e as Error).message);
      throw e;
    }
  }
}
