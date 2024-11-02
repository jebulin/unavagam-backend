import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { ShopModule } from './shop/shop.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    host: "txlvz.h.filess.io",
    username: "una_reportthis",
    password: "ce279eebae4d3861d65a95539cf042a34fb49bee",
    database: "una_reportthis",
    // host: "localhost",
    port: 3307,
    // username: "root",
    // password: "root",
    // database: "unavagam",
    entities: ['././entities/.ts'],
    autoLoadEntities: true,
    synchronize: false
  }),
  MailerModule.forRoot({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  }),
  AuthModule,
    MailModule,
    UsersModule,
    ClientModule,
    ShopModule,
    CategoryModule,
    ProductModule,
    MenuModule,
    OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
