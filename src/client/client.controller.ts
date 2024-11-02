import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiInternalServerErrorResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptors';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/user.roles';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/shared/decorators/user.decorators';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('clients')
@ApiTags("Clients")
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
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "get all clients" })
  @Get()
  findAll(@User() loggedUser: any) {
    return this.clientService.findAll(loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "create client, it creates a shop also" })
  @Post()
  async create(@Body() createClientDto: CreateClientDto, @User() loggedUser: any) {
    return await this.clientService.create(createClientDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('update')
  @ApiOperation({ summary: "update client" })
  async update(@Body() updateClientDto: UpdateClientDto, @User() loggedUser: any) {
    return await this.clientService.update(updateClientDto, loggedUser);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: "delete client, this deletes all the client shops" })
  async remove(@Param('id') id: string, @User() loggedUser: any) {
    return await this.clientService.remove(+id, loggedUser);
  }
}
