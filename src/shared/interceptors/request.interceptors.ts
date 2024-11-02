import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { catchError, map, Observable, of, timeout, TimeoutError } from "rxjs";
import { Response } from "../interface/response.interface";


@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();

        let responseObject: Response = {};

        if (undefined === request.headers["x-shop-id"] || "" === request.headers['x-shop-id']) {
            responseObject.statusCode = new BadRequestException().getStatus();
            responseObject.status = false;
            responseObject.error = new BadRequestException().message;
            return of(responseObject);
        }


        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(map(data => {
            responseObject.statusCode = 200;
            responseObject.status = true;
            responseObject.data = data;
            response.status(200);
            return responseObject;
        }), timeout(60000),
            catchError((err) => {
                console.log("inside err in intereceptor: ", err);
                responseObject.status = false;
                if (err instanceof TimeoutError) {
                    responseObject.statusCode = new RequestTimeoutException().getStatus();
                    responseObject.error = String(err);
                } else if (err.hasOwnProperty("response")) {
                    responseObject.statusCode = err.response.statusCode || 500;
                    responseObject.error = err.response.error || String(err);
                } else {
                    responseObject.statusCode = err?.error?.statusCode ?? err?.statusCode ?? 500;
                    responseObject.error = err?.error?.message ?? err?.message ?? String(err);
                }

                response.status(responseObject.statusCode);
                return of(responseObject);
            })
        )
    }
}