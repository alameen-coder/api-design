import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'beforeExit'>
  implements OnModuleInit
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  // Method to clean the database for E2E tests
  async cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
