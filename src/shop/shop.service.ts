import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/shared/enums/user.roles';
import { Status } from 'src/shared/enums/status';
import { SubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class ShopService {
  constructor(@InjectRepository(Shop)
  private readonly shopRepository: Repository<Shop>) { }

  async create(createShopDto: CreateShopDto, loggedUser: any) {
    try {
      createShopDto.username = createShopDto.username.toLowerCase();
      let shop = await this.findOneBy({ username: createShopDto.username })
      if (shop)
        throw { message: "shop already present", statusCode: 409 };

      if (shop?.subscriptionStartDate || shop?.subscriptionStartDate && shop?.subscriptionStartDate == shop?.subscriptionEndDate) {
        throw { message: "please enter valid subscription", statusCode: 409 };
      }

      if (!createShopDto?.clientId) {
        let clientId = await this.currentShopClientId(loggedUser);
        createShopDto.clientId = clientId;
      }
      createShopDto.createdBy = loggedUser.id;
      await this.shopRepository.save(createShopDto);

      return 'new shop is added';
    } catch (err) {
      console.log("Error in create shop ", err);
      throw { message: err?.message || "Error in create shop ", statusCode: err?.statusCode || 500 }
    }
  }

  async findAll(loggedUser) {
    try {
      let allShops: Shop[] = [];
      if (loggedUser?.roleId == UserRole.SUPER_ADMIN) {
        allShops = await this.shopRepository.find();
      } else {
        allShops = await this.currentClientShops(loggedUser);
      }

      return allShops;
    } catch (err) {
      console.log("Error in findall shop ", err);
      throw { message: err?.message || "Error in findall shop ", statusCode: err?.statusCode || 500 }
    }
  }

  async update(updateShopDto: UpdateShopDto, loggedUser: any) {
    try {
      delete updateShopDto.subscriptionStartDate;
      delete updateShopDto.subscriptionEndDate;
      delete updateShopDto.subscriptionName;

      let shop = await this.findOneByOrFail({ id: loggedUser.shopId });

      this.shopRepository.merge(shop, updateShopDto);

      shop.updatedBy = loggedUser.id;
      await this.shopRepository.save(shop);

      return "shop is updated";
    } catch (err) {
      console.log("Error in shop update", err);
      throw { message: err?.message || "Error in shop update", statusCode: err?.statusCode || 500 }
    }
  }

  async updateSubscription(subscriptionDto: SubscriptionDto, loggedUser: any) {
    try {
      let shop = await this.findOneByOrFail({ id: loggedUser.shopId });

      this.shopRepository.merge(shop, subscriptionDto);

      shop.updatedBy = loggedUser.id;
      await this.shopRepository.save(shop);

      return "shop's subscription is updated";
    } catch (err) {
      console.log("Error in shop subscription update", err);
      throw { message: err?.message || "Error in shop's subsciption update", statusCode: err?.statusCode || 500 }
    }
  }

  async remove(id: number, loggedUser) {
    try {
      let shop = await this.findOneBy({ id });
      if (!shop)
        throw { message: "shop not present", statusCode: 409 };

      shop.updatedBy = loggedUser.id;
      shop.status = Status.DELETED;
      await this.shopRepository.save(shop);

      return "shop is deleted";
    } catch (err) {
      console.log("Error in shop delete", err);
      throw { message: err?.message || "Error in shop delete ", statusCode: err?.statusCode || 500 }
    }
  }

  async findOneBy(where: any) {
    return await this.shopRepository.findOneBy(where);
  }

  async findOneByOrFail(where: any) {
    try {
      return await this.shopRepository.findOneByOrFail(where);
    }
    catch (err) {
      throw { message: "shop not present", statusCode: 404 };
    }
  }

  async currentShopClientId(loggedUser) {
    try {
      let currentShop = await this.findOneBy({ id: loggedUser.shopId });
      return currentShop.clientId;
    } catch (err) {
      console.log("Error in client id get", err);
      throw { message: err?.message || "Error in client id get ", statusCode: err?.statusCode || 500 }
    }
  }

  async deleteAllShops(clientId: number, loggedUser) {
    try {
      let shops = await this.shopRepository.findBy({ clientId });
      for (let shop of shops) {
        shop.status = Status.DELETED;
        shop.updatedBy = loggedUser.id;
        await this.shopRepository.save(shop);
      }

      return true;
    }
    catch (err) {
      throw { message: "error in delte shop", statusCode: 404 };
    }
  }

  async currentClientShops(loggedUser) {
    try {
      let clientId = await this.currentShopClientId(loggedUser);

      return await this.shopRepository.find({ where: { clientId } });
      
    } catch (err) {
      console.log("Error in findall shop ", err);
      throw { message: err?.message || "Error in findall shop ", statusCode: err?.statusCode || 500 }
    }
  }
}
