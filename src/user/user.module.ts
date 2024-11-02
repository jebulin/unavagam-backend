import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ShopUser } from './entities/shop-users.entity';
import { MailModule } from 'src/mail/mail.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ShopUser]), MailModule, ShopModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule { }
