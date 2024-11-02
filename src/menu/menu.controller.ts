import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/shared/decorators/user.decorators';
import { AddProductsDto } from './dto/add-products.dto';

@ApiTags("Menu")
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
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT, UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "find all menu" })
  @Get()
  async findAll(@User() loggedUser) {
    return await this.menuService.findAll(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT, UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "get menu products" })
  @Get('products/:id')
  async getMenuProducts(@Param('id') menuId:string, @User() loggedUser) {
    return await this.menuService.getMenuProducts(+menuId, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create menu" })
  @Post('create')
  async create(@Body() createMenuDto: CreateMenuDto,@User() loggedUser) {
    return await this.menuService.create(createMenuDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "add products to menu" })
  @Post('add-products')
  async addProduct(@Body() addProductsDto: AddProductsDto,@User() loggedUser) {
    return await this.menuService.addProducts(addProductsDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "delete products from menu" })
  @Delete('remove-products/:id')
  async removeProduct(@Param('id') id: string,@User() loggedUser) {
    return await this.menuService.removeProduct(+id, loggedUser);
  }


  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "update menu" })
  @Post('update')
  async update(@Body() updateMenuDto: UpdateMenuDto,@User() loggedUser) {
    return await this.menuService.update(updateMenuDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "delete menu" })
  @Delete(':id')
  async remove(@Param('id') id: string,@User() loggedUser) {
    return await this.menuService.remove(+id, loggedUser);
  }
}

