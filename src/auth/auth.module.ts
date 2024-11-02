import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports:[UsersModule, JwtModule.register({
    global: true,
    secret: "unavagam",
    signOptions: {expiresIn: "86400s"}
  }), ShopModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
