import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/shared/enums/status';
import { UserRole } from 'src/shared/enums/user.roles';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { uid } from 'rand-token';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { ShopUser } from './entities/shop-users.entity';
import { ShopService } from 'src/shop/shop.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ShopUser)
    private readonly shopUserRepository: Repository<ShopUser>,
    private readonly shopService: ShopService,
    private readonly mailService: MailService
  ) { }

  saltOrRounds = 10;

  // jebulin3@gmail.com
  // 3875

  async create(createUserDto: CreateUserDto, loggedUser: any) {

    let newUser = false;

    this.checkRoleAssignCompactibality(loggedUser, createUserDto.roleId);

    let usersRoleId = createUserDto.roleId;
    try {
      let savedUser = await this.findOneBy({ email: createUserDto.email });

      if (!savedUser || savedUser.status == Status.INACTIVE) {
        savedUser?.status ? savedUser.status = Status.ACTIVE : null;

        let randomPassword = this.generatePassword();
        console.log(createUserDto.email, randomPassword);

        if (savedUser) {
          savedUser.password = await this.hashPassword(randomPassword);
          savedUser.updatedBy = loggedUser.id;

        } else {
          createUserDto.password = await this.hashPassword(randomPassword);
          createUserDto.createdBy = loggedUser.id;
          newUser = true;
          if (usersRoleId != UserRole.SUPER_ADMIN)
            createUserDto.roleId = null;
        }

        if (savedUser)
          savedUser = await this.userRepository.save(savedUser);
        else
          savedUser = await this.userRepository.save(createUserDto);

        await this.mailService.sendMail({
          to: savedUser.email,
          data: {
            firstName: savedUser.firstName,
            password: randomPassword
          },
          subject: "Unavagam - You are assigned a shop ",
          template: "new-user"
        })
      }

      if (usersRoleId != UserRole.SUPER_ADMIN && usersRoleId != UserRole.OWNER) {
        let shopUserDto = { shopId: loggedUser.shopId, userId: savedUser.id, roleId: usersRoleId, createdBy: loggedUser.id };
        let shopUserDetails = await this.shopUserRepository.findOneBy({ shopId: loggedUser.shopId, userId: savedUser.id, status: Status.ACTIVE });
        if (shopUserDetails) {
          throw { message: "user is already assigned to the shop " };
        }
        await this.shopUserRepository.save(shopUserDto);
      } else if (usersRoleId == UserRole.OWNER && newUser) {
        let clientShops = await this.shopService.currentClientShops(loggedUser);

        for (let clientShop of clientShops) {
          let shopUserDto = { shopId: clientShop.id, userId: savedUser.id, roleId: usersRoleId, createdBy: loggedUser.id };
          let shopUserDetails = await this.shopUserRepository.findOneBy({ shopId: clientShop.id, userId: savedUser.id, status: Status.ACTIVE });
          if (shopUserDetails) {
            throw { message: "user is already assigned to the shop " };
          }
          await this.shopUserRepository.save(shopUserDto);
        }

      }
      return "user is created";

    } catch (err) {
      console.log("Error in user creation: ", err);
      throw { message: err?.message || "Error while creating User", statusCode: err?.statusCode || 500 }

    }
  }

  async getAllShopUsers(loggedUser) {
    try {
      let [users, others] = await this.userRepository.query("CALL sp_unavagam_getAllShopsUser(?,?)", [loggedUser.shopId, loggedUser.roleId]);
      return users;
    }
    catch (err) {
      console.log("Error in getAllShopUsers: ", err);
      throw { message: err?.message || "Error in getAllShopUsers ", statusCode: err?.statusCode || 500 }

    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, loggedUser: any) {

    try {
      let user = await this.findOneByOrFail({ id: loggedUser.id });

      if (changePasswordDto.oldPassword == changePasswordDto.newPassword)
        throw { message: "new and old passwords are same", statusCode: 500 };

      if (!await bcrypt.compare(changePasswordDto.oldPassword, user.password)) {
        throw { message: "entered old password is wrong", statusCode: 500 };
      }

      user.password = await this.hashPassword(changePasswordDto.newPassword);
      user.updatedBy = loggedUser.id;
      await this.userRepository.save(user);

      return "Password changed successfully";

    } catch (err) {
      console.log("error in change password", err)
      throw { message: err?.message || "Error in change password", statusCode: err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR }

    }
  }

  async update(updateUserDto: UpdateUserDto, loggedUser: any) {
    try {
      let user = await this.findOneByOrFail({ id: loggedUser.id });

      delete updateUserDto.password;

      this.userRepository.merge(user, updateUserDto);

      await this.userRepository.save(user);

      return `User is updated`;
    } catch (err) {
      console.log("error in user update", err)
      throw { message: err?.message || "Error in change password", statusCode: err?.statusCode || 500 }

    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto, loggedUser: any) {
    try {
      // need to think logic to convert owner to other role 
      let user = await this.findOneByOrFail({ id: updateRoleDto.userId });

      this.checkRoleAssignCompactibality(loggedUser, updateRoleDto.roleId);

      if (updateRoleDto.roleId == UserRole.SUPER_ADMIN) {
        await this.shopUserRepository.delete({ userId: Number(updateRoleDto.userId) });
        user.roleId = UserRole.SUPER_ADMIN;
        await this.userRepository.save(user);
      } else {
        let shopUser = await this.shopUserRepository.findOne({ where: { shopId: loggedUser.shopId, userId: updateRoleDto.userId } });
        if (!shopUser)
          throw { message: "user is not assigned to any shop", statusCode: 404 };

        shopUser.roleId = updateRoleDto.roleId;
        shopUser.updatedBy = loggedUser.id;
        await this.shopUserRepository.save(shopUser);
        if (updateRoleDto.roleId == UserRole.OWNER) {
          let clientShops = await this.shopService.currentClientShops(loggedUser);

          for (let clientShop of clientShops) {
            if (clientShop.id == loggedUser.shopId) continue;
            let shopUserDto = { shopId: clientShop.id, userId: user.id, roleId: updateRoleDto.roleId, createdBy: loggedUser.id };
            let shopUserDetails = await this.shopUserRepository.findOneBy({ shopId: clientShop.id, userId: user.id, status: Status.ACTIVE });
            if (shopUserDetails) {
              throw { message: "user is already assigned to the shop " };
            }
            await this.shopUserRepository.save(shopUserDto);
          }
        }
      }
      return "Users role is updated";

    } catch (err) {
      console.log("error in user update", err)
      throw { message: err?.message || "Error in change password", statusCode: err?.statusCode || 500 }

    }
  }


  async remove(id: number, loggedUser: any) {
    try {
      let user = await this.findOneByOrFail({ id });

      if (user.roleId == UserRole.SUPER_ADMIN) {
        user.status = Status.INACTIVE;
        user.updatedBy = loggedUser.id;
        await this.userRepository.save(user);
      }
      else {
        let shopUserList = await this.shopUserRepository.find({ where: { userId: id } });

        if (shopUserList.length == 0)
          throw { message: "User is not assigned to any shop", statusCode: 400 };

        if (user.roleId == UserRole.OWNER) {
          for (let shopUser of shopUserList) // deletes for all the shops the user is assigend
            await this.shopUserRepository.delete(shopUser.id);

          user.status = Status.INACTIVE;
          user.updatedBy = loggedUser.id;
          await this.userRepository.save(user);
        } else {
          if (shopUserList.length > 1) {
            let shopUser = shopUserList.find(list => list.shopId == loggedUser.shopId);
            if (!shopUser)
              throw { message: "User is not assigned to the shop", statusCode: 404 };

            await this.shopUserRepository.delete(shopUser.id);
          } else if (shopUserList.length == 1) {
            let shopUser = shopUserList.find(list => list.shopId == loggedUser.shopId);
            if (!shopUser)
              throw { message: "User is not assigned to the shop", statusCode: 404 };

            await this.shopUserRepository.delete(shopUser.id);
            user.status = Status.INACTIVE;
            user.updatedBy = loggedUser.id;
            await this.userRepository.save(user);
          }
        }
      }
      return `User is deleted`;
    } catch (err) {
      console.log("Error while deleting user", err);
      throw { message: err?.message || "Error delete user", statusCode: err?.statusCode || 500 }
    }
  }


  async findOneBy(where: any) {
    return await this.userRepository.findOneBy(where);
  }

  async findOneByOrFail(where: any) {
    try {
      return await this.userRepository.findOneByOrFail(where);
    } catch (err) {
      throw { message: "user not present", statusCode: 404 };
    }
  }

  async updatelastLogin(user: User) {
    user.lastActive = new Date();
    await this.userRepository.save(user);
    return true;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  async findUsersFirstAvailableShop(userId: number) {
    return await this.shopUserRepository.findOneBy({ userId: userId, status: Status.ACTIVE });
  }

  async forgotPassword(email: string, phoneNumber: string = null) {
    try {
      let user = null;

      if (email)
        user = await this.findOneByOrFail({ email: email, status: Status.ACTIVE });
      else
        user = await this.findOneByOrFail({ phoneNumber: phoneNumber, status: Status.ACTIVE });

      let password = this.generatePassword();
      user.password = await this.hashPassword(password);
      console.log(user?.email, user?.phoneNumber , password);
      await this.userRepository.save(user);

      if (email) {
        this.mailService.sendMail({
          to: user.email,
          data: {
            firstName: user.firstName,
            password: password
          },
          subject: "Unavagam - Forgot password ",
          template: "password-reset"
        })
      } else {
        // need to send password to mobile;
      }

      return "success";

    } catch (err) {
      console.log("Error in forget passsword", err);
      throw { message: err?.message || "Error in forget password", statusCode: err?.statusCode || 500 }
    }
  }

  checkRoleAssignCompactibality(loggedUser: any, roleId: number) {
    if (loggedUser.roleId == UserRole.SUPER_ADMIN) {
      if (![UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT].includes(roleId)) {
        throw { message: "role not present", statuCode: 404 }
      }
    } else if (loggedUser.roleId == UserRole.OWNER) {
      if (![UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT].includes(roleId)) {
        throw { message: "User not allowed to create the particular role", statuCode: 404 }
      }
    } else if (loggedUser.roleId == UserRole.OWNER) {
      if (![UserRole.OWNER, UserRole.MANAGER, UserRole.PILOT].includes(roleId)) {
        throw { message: "User not allowed to create the particular role", statuCode: 404 }
      }
    }
    else {
      throw { message: "User not allowed to create user" }
    }
  }

  generateRandomToken() {
    return uid(12);
  }

  generatePassword() {
    return String(Math.round(Math.random() * 10000));
  }



}
