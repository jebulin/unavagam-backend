import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorators';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller('shop')
@ApiTags("Shop")
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiInternalServerErrorResponse()
@ApiHeader({
  name: "X-Shop-Id",
  description: "Shop ID"
})
@UseInterceptors(RequestInterceptor)
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: "get all shops" })
  findAll(@User() loggedUser: any) {
    return this.shopService.findAll(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create shop" })
  @Post()
  async create(@Body() createShopDto: CreateShopDto, @User() loggedUser: any) {
    return await this.shopService.create(createShopDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @UseGuards(RolesGuard)
  @Post('update/shop-details')
  @ApiOperation({ summary: "update shop details" })
  async update(@Body() updateShopDto: UpdateShopDto, @User() loggedUser: any) {
    return await this.shopService.update(updateShopDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('update/shops-subscription')
  @ApiOperation({ summary: "update shop subscription" })
  async updateSubscription(@Body() subscriptionDto: SubscriptionDto, @User() loggedUser: any) {
    return await this.shopService.updateSubscription(subscriptionDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: "delete shop" })
  async remove(@Param('id') id: string, @User() loggedUser: any) {
    return await this.shopService.remove(+id, loggedUser);
  }

  
}
