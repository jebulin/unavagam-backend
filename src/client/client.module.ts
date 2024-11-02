import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientsController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports:[TypeOrmModule.forFeature([Client]), ShopModule],
  controllers: [ClientsController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
