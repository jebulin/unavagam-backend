import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        let hasPermission = false;
        const roles = this.reflector.get<string>('roles', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && roles && roles.indexOf(user.roleId) > -1) {
            hasPermission = true;
        }
        console.log(hasPermission)
        return hasPermission;
    }
}