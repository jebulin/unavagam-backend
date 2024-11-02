import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Status } from 'src/shared/enums/status';
import { UserRole } from 'src/shared/enums/user.roles';
import { ShopService } from 'src/shop/shop.service';
import { ForgotPasswordDTO } from './dto/forgot.password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly shopService: ShopService,
  ) { }

  async login(username: string, pass: string) {
    try {
      const user = await this.userService.findOneBy({ email: username, status: Status.ACTIVE });
      if (!user)
        throw { message: "unauthorized, user not present", statusCode: HttpStatus.BAD_REQUEST, status: false };

      console.log(user, pass, await bcrypt.compare(pass, user.password))
      if (!await bcrypt.compare(pass, user.password))
        throw new UnauthorizedException();

      const { password, ...result } = user;
      let roleId = user?.roleId;
      await this.userService.updatelastLogin(user);
      const payload = { sub: user.id, ...result, roleId, shopId: null, shopDetails: null }

      if (roleId != UserRole.SUPER_ADMIN) {
        let shopUser = await this.userService.findUsersFirstAvailableShop(user.id);
        if (!shopUser) {
          console.log("No shop user detail present in firm user table")
          throw new UnauthorizedException();
        }
        let firmDetails = await this.shopService.findOneBy({ id: shopUser.shopId, status: Status.ACTIVE })
        payload.shopDetails = firmDetails;
        payload.roleId = shopUser.roleId;
        payload.shopId = shopUser.shopId;
      } else {
        let shopDetails = await this.shopService.findAll({ roleId: UserRole.SUPER_ADMIN });
        payload.shopId = shopDetails[0].id;
        payload.shopDetails = shopDetails[0];
        payload.roleId = roleId;
      }

      return {
        ...result,
        shopDetails: payload.shopDetails,
        roleId,
        access_token: await this.jwtService.signAsync(payload)
      };
    } catch (err) {
      console.log("Error in login: ", err);
      throw { message: err?.message || "Error while login", statusCode: err?.statusCode || err?.status || HttpStatus.INTERNAL_SERVER_ERROR, status: false }
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    return await this.userService.forgotPassword(forgotPasswordDTO.email);
  }

}
