import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Status } from 'src/shared/enums/status';
import { AddProductsDto } from './dto/add-products.dto';
import { MenuProduct } from './entities/menu-products.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class MenuService {

  constructor(@InjectRepository(Menu)
  private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuProduct)
    private readonly menuProductRepository: Repository<MenuProduct>,
    private readonly productService: ProductService) { }

  async create(createMenuDto: CreateMenuDto, loggedUser) {
    try {
      createMenuDto.name = createMenuDto.name.toLowerCase();
      let menu = await this.findOneBy({ name: createMenuDto.name, shopId: loggedUser.shopId });
      if (menu && menu.status == Status.ACTIVE)
        throw { message: "menu already present", statusCode: 409 };

      if (menu && (menu.status == Status.INACTIVE || menu.status == Status.DELETED)) {
        this.menuRepository.merge(menu, createMenuDto)
        menu.updatedBy = loggedUser.id;
        menu.status = Status.ACTIVE
      } else {
        createMenuDto.createdBy = loggedUser.id;
        createMenuDto.shopId = loggedUser.shopId;
      }

      if (menu)
        await this.menuRepository.save(menu);
      else
        await this.menuRepository.save(createMenuDto);

      return "menu is created";

    }
    catch (err) {
      throw { message: err.message || "Error in creating menu", statusCode: err.statusCode || 500 }
    }
  }

  async findAll(loggedUser) {
    try {
      return await this.menuRepository.findBy({ shopId: loggedUser.shopId })
    } catch (err) {
      throw { message: err.message || "Error in get all menus", statusCode: err.statusCode || 500 }
    }
  }

  async getMenuProducts(menuId:number, loggedUser) {
    try {
      let [menuProducts, others] = await this.menuProductRepository.query("CALL sp_unavagam_getAllMenuProducts(?)",[menuId]);

      return menuProducts;
    } catch (err) {
      throw { message: err.message || "Error in get all menu products", statusCode: err.statusCode || 500 }
    }
  }

  async update(updateMenuDto: UpdateMenuDto, loggedUser) {
    try {

      let menu = await this.findOneByOrFail({ id: updateMenuDto.id });

      this.menuRepository.merge(menu, updateMenuDto);

      menu.updatedBy = loggedUser.id;
      await this.menuRepository.save(menu);

      return "menu is updated";
    } catch (err) {
      console.log("Error in menu update", err);
      throw { message: err?.message || "Error in menu update", statusCode: err?.statusCode || 500 }
    }
  }

  async remove(id: number, loggedUser) {
    try {
      let menu = await this.findOneByOrFail({ id });
      menu.status = Status.DELETED;
      menu.updatedBy = loggedUser.id;
      await this.menuRepository.save(menu);
      return "menu is deleted";
    } catch (err) {
      console.log("Error in menu update", err);
      throw { message: err?.message || "Error in menu update", statusCode: err?.statusCode || 500 }
    }
  }

  async addProducts(addProductsDto: AddProductsDto, loggedUser) {
    try {

      await this.findOneByOrFail({ id: addProductsDto.menuId, status: Status.ACTIVE });

      if (addProductsDto.productIds.length == 0)
        throw { message: "no products is sent", statusCode: 404 };

      let alreadyPresent = [];
      let addProducts = [];
      for (let productId of addProductsDto.productIds) {

        await this.productService.findOneByOrFail({ id: productId, shopId: loggedUser.shopId }) // checks whether the product is available 
        let alreadyPresentProduct = await this.menuProductRepository.findOneBy({ menuId: addProductsDto.menuId, productId: productId });

        if (alreadyPresentProduct)
          alreadyPresent.push(productId)
        else {
          let menuProduct = { menuId: addProductsDto.menuId, productId, createdBy: loggedUser.id }
          addProducts.push(menuProduct);
        }
      }

      if (alreadyPresent.length == 0){
        await this.menuProductRepository.save(addProducts)
        return "products are added to menu ";
      }
      else
        return { message: "some products are already present and so please check and reupload", productIds: alreadyPresent };

    }
    catch (err) {
      throw { message: err.message || "Error in add products to menu", statusCode: err.statusCode || 500 }
    }
  }

  async removeProduct(id: number, loggedUser) {
    try {
      let menuProduct = await this.menuProductRepository.findOneBy({ id });
      if (!menuProduct)
        throw { message: "menu product not present", statusCode: 404 };

      await this.menuProductRepository.delete(menuProduct);
      return "menu product is deleted";
    } catch (err) {
      console.log("Error in menu update", err);
      throw { message: err?.message || "Error in menu update", statusCode: err?.statusCode || 500 }
    }
  }

  async findOneBy(where: Partial<Menu>) {
    return await this.menuRepository.findOneBy(where);
  }

  async findOneByOrFail(where) {
    try {
      return await this.menuRepository.findOneByOrFail(where);
    } catch (err) {
      throw { message: "menu not present", statusCode: 404 };
    }
  }
}
