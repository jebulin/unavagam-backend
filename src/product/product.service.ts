import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Status } from 'src/shared/enums/status';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {

  constructor(@InjectRepository(Product)
  private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService) { }

  async create(createProductDto: CreateProductDto, loggedUser) {
    try {
      let product = await this.findOneBy({ name: createProductDto.name, shopId: loggedUser.shopId });
      if (product && product.status == Status.ACTIVE)
        throw { message: "product already present", statusCode: 409 };

      if (createProductDto.categoryId) {
        await this.categoryService.findOneByOrFail({ id: createProductDto.categoryId });
      }

      if (product && (product.status == Status.INACTIVE || product.status == Status.DELETED)) {
        this.productRepository.merge(product, createProductDto)
        product.updatedBy = loggedUser.id;
        product.status = Status.ACTIVE
      } else {
        createProductDto.createdBy = loggedUser.id;
        createProductDto.shopId = loggedUser.shopId;
      }

      if (product)
        await this.productRepository.save(product);
      else
        await this.productRepository.save(createProductDto);

      return "product is created";

    }
    catch (err) {
      throw { message: err.message || "Error in creating product", statusCode: err.statusCode || 500 }
    }
  }

  async findAll(loggedUser) {
    try {
      return await this.productRepository.findBy({ shopId: loggedUser.shopId })
    } catch (err) {
      throw { message: err.message || "Error in get all products", statusCode: err.statusCode || 500 }
    }
  }

  async update(updateProductDto: UpdateProductDto, loggedUser) {
    try {

      let product = await this.findOneByOrFail({ id: updateProductDto.id });

      if (updateProductDto.categoryId) {
        await this.categoryService.findOneByOrFail({ id: updateProductDto.categoryId });
      }

      this.productRepository.merge(product, updateProductDto);

      product.updatedBy = loggedUser.id;
      await this.productRepository.save(product);

      return "product is updated";
    } catch (err) {
      console.log("Error in product update", err);
      throw { message: err?.message || "Error in product update", statusCode: err?.statusCode || 500 }
    }
  }

  async remove(id: number, loggedUser) {
    try {
      let product = await this.findOneByOrFail({ id });
      product.status = Status.DELETED;
      product.updatedBy = loggedUser.id;
      await this.productRepository.save(product);
      return "product is deleted";
    } catch (err) {
      console.log("Error in product update", err);
      throw { message: err?.message || "Error in product update", statusCode: err?.statusCode || 500 }
    }
  }


  async findOneBy(where: Partial<Product>) {
    return await this.productRepository.findOneBy(where);
  }

  async findOneByOrFail(where: Partial<Product>) {
    try {
      return await this.productRepository.findOneByOrFail(where);
    } catch (err) {
      throw { message: "product not present", statusCode: 404 };
    }
  }
}
