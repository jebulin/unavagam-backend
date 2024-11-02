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
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME,
    port: 3307,
    // host: "localhost",
    // username: "root",
    // password: "root",
    // database: "unavagam",
    // port: 3306,
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
