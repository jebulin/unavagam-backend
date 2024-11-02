import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuProduct } from './entities/menu-products.dto';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuProduct]), ProductModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule { }
