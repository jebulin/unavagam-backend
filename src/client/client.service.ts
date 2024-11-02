import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/shop/shop.service';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { Status } from 'src/shared/enums/status';

@Injectable()
export class ClientService {

  constructor(@InjectRepository(Client)
  private readonly clientRepository: Repository<Client>,
    private readonly shopService: ShopService) { }

  async create(createClientDto: CreateClientDto, loggedUser) {
    try {
      createClientDto.name = createClientDto.name.toLowerCase();
      createClientDto.username = createClientDto.username.toLowerCase();
      let client = await this.findOneBy({ name: createClientDto.name });
      let shop = await this.shopService.findOneBy({ username: createClientDto.username });
      if (client)
        throw { message: "client already present", statusCode: 409 };

      if (shop)
        throw { message: "username already present", statusCode: 409 };

      createClientDto.createdBy = loggedUser.id;
      let savedClient = await this.clientRepository.save(createClientDto);
      let createShopDto: CreateShopDto = {
        createdBy: loggedUser.id,
        name: createClientDto.name,
        location: createClientDto.location,
        contact: createClientDto.contact,
        clientId: savedClient.id,
        username: createClientDto.username,
        subscriptionStartDate: createClientDto.subscriptionStartDate,
        subscriptionEndDate: createClientDto.subscriptionEndDate,
        subscriptionName: createClientDto.subscriptionName
      }
      await this.shopService.create(createShopDto, loggedUser);
      return 'New client is added';
    } catch (err) {
      console.log("Error in create client ", err);
      throw { message: err?.message || "Error in create client ", statusCode: err?.statusCode || 500 }
    }
  }

  async findAll(loggedUser) {
    try {
      let [clients, others] = await this.clientRepository.query("CALL sp_unavagam_getAllClients()", []);

      return clients;
    } catch (err) {
      console.log("Error in findAll client ", err);
      throw { message: err?.message || "Error in findAll client ", statusCode: err?.statusCode || 500 }
    }
  }

  async update(updateClientDto: UpdateClientDto, loggedUser) {
    try {

      let client = await this.findOneByOrFail({ id: updateClientDto.id });

      this.clientRepository.merge(client, updateClientDto);
      client.updatedBy = loggedUser.id;
      await this.clientRepository.save(client);

      return "client is updated";
    }
    catch (err) {
      console.log("Error in findAll client ", err);
      throw { message: err?.message || "Error in findAll client ", statusCode: err?.statusCode || 500 }
    }
  }

  async remove(id: number, loggedUser) {
    try {
      let client = await this.findOneByOrFail({ id });

      await this.shopService.deleteAllShops(id, loggedUser);

      client.status = Status.DELETED;
      client.updatedBy = loggedUser.id;
      await this.clientRepository.save(client);

      return "client is deleted";
    }
    catch (err) {
      console.log("Error in findAll client ", err);
      throw { message: err?.message || "Error in findAll client ", statusCode: err?.statusCode || 500 }
    }
  }

  async findOneBy(where: any) {
    return await this.clientRepository.findOneBy(where);
  }

  async findOneByOrFail(where: any) {
    try {
      return await this.clientRepository.findOneByOrFail(where);
    }
    catch (err) {
      throw { message: "client not present", statusCode: 404 };
    }
  }
}
