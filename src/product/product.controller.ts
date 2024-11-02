import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/shared/decorators/user.decorators';

@ApiTags("Products")
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
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT, UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "find all product" })
  @Get('get-all')
  async findAll(@User() loggedUser) {
    return await this.productService.findAll(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create product" })
  @Post('create')
  async create(@Body() createProductDto: CreateProductDto, @User() loggedUser) {
    return await this.productService.create(createProductDto, loggedUser);
  }
  
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "update product" })
  @Post('update')
  async update( @Body() updateProductDto: UpdateProductDto, @User() loggedUser) {
    return await this.productService.update(updateProductDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "delete product" })
  @Delete(':id')
  async remove(@Param('id') id: string, @User() loggedUser) {
    return await this.productService.remove(+id, loggedUser);
  }
}
