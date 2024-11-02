import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.headers;

        // request.user['shopId']  = headers["x-shop-id"] //?? request.user['firmId']
        

        return request.user;
    }
)