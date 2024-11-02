import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(@InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto, loggedUser: any) {
    try {
      createCategoryDto.name = createCategoryDto.name.toLowerCase();
      let category = await this.findOneBy({ name: createCategoryDto.name, typeId: createCategoryDto.typeId });
      if (category)
        throw { message: "category already present", statusCode: 404 };

      if (createCategoryDto.parentId) {
        await this.findOneByOrFail({ id: createCategoryDto.parentId }); // check if the parent is present or throw error
      }
      createCategoryDto.createdBy = loggedUser.id;
      if (createCategoryDto.parentId) createCategoryDto.typeId = null;
      await this.categoryRepository.save(createCategoryDto);

      return "category is created";
    }
    catch (err) {
      throw { message: err.message || "Error in creating category", statusCode: err.statusCode || 500 }
    }
  }

  async getAll(loggedUser) {
    try {
      let [categories, others] = await this.categoryRepository.query("CALL sp_unavagam_getAllCategories()", []);
      return categories;
    }
    catch (err) {
      throw { message: err.message || "Error in getAll category", statusCode: err.statusCode || 500 }
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto, loggedUser) {
    try {

      let category = await this.findOneByOrFail({ id: updateCategoryDto.id });

      if (updateCategoryDto.parentId) {
        await this.findOneByOrFail({ id: updateCategoryDto.parentId }); // check if the parent is present or throw error
      }

      this.categoryRepository.merge(category, updateCategoryDto);

      category.updatedBy = loggedUser.id;
      await this.categoryRepository.save(category);

      return "category is updated";
    } catch (err) {
      console.log("Error in category update", err);
      throw { message: err?.message || "Error in category update", statusCode: err?.statusCode || 500 }
    }
  }

  async remove(id: number) {
    try {
      await this.categoryRepository.delete(id);
      return "category is removed";
    } catch (err) {
      console.log("Error in category update", err);
      throw { message: err?.message || "Error in category update", statusCode: err?.statusCode || 500 }
    }
  }

  async findOneBy(where) {
    return await this.categoryRepository.findOneBy(where);
  }

  async findOneByOrFail(where) {
    try {
      return await this.categoryRepository.findOneByOrFail(where);
    } catch (err) {
      throw { message: "category not present", statusCode: 404 };

    }
  }

}
