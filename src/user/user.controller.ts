import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { User } from 'src/shared/decorators/user.decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags("Users")
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@ApiHeader({
  name: "X-Shop-Id",
  description: "Shop ID"
})
@Controller('users')
@UseInterceptors(RequestInterceptor)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "get all current shop's users" })
  @Get('shop-users')
  getAllShopUsers(@User() loggedUser) {
    return this.userService.getAllShopUsers(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create new user used after login" })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @User() loggedUser) {
    return await this.userService.create(createUserDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "update user" })
  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto, @User() loggedUser) {
    return this.userService.update(updateUserDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "update role " })
  @Post('update-role')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto, @User() loggedUser) {
    return await this.userService.updateRole(updateRoleDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "change password" })
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() loggedUser) {
    return await this.userService.changePassword(changePasswordDto, loggedUser);
  }


  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "delete user" })
  @Delete(':id')
  remove(@Param('id') id: string, @User() loggedUser) {
    return this.userService.remove(+id, loggedUser);
  }
}
