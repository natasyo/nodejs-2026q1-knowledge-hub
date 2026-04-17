// import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }
    const connectionString = process.env.DATABASE_URL;

    const pool = new Pool({ connectionString });

    const adapter = new PrismaPg(pool);
    super({
      adapter,
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
