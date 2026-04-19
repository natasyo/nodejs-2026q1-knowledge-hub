import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, JwtStrategy],
})
export class ArticlesModule {}
