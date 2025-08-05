import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    this.$connect();
    console.log('PrismaService initialized and connected to the database');
    // Called when the module is initialized
  }

  onModuleDestroy() {
    this.$disconnect();
    console.log('PrismaService disconnected from the database');
    // Called when the module is destroyed
  }
}
