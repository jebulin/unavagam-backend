import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { ForgotPasswordDTO } from './dto/forgot.password.dto';

@Controller('auth')
@ApiTags("Auth")
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "login" })
  @Post('login')
  create(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto.username, signInDto.password);
  }

  @ApiOperation({ summary: "Forgot password" })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(forgotPasswordDTO);
  }

}
