import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { User } from 'src/shared/decorators/user.decorators';

@ApiTags("Category")
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@ApiHeader({
  name: "X-Shop-Id",
  description: "Shop ID"
})
@UseInterceptors(RequestInterceptor)
@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "get all category" })
  @Get('get-all')
  getAll(@User() loggedUser:any) {
    return this.categoryService.getAll(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create category" })
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() loggedUser:any) {
    return await this.categoryService.create(createCategoryDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "update category can be done only by super admin" })
  @Post('update')
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @User() loggedUser) {
    return await this.categoryService.update( updateCategoryDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "delete category can be done only by super admin" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
