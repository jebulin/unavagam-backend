import { DynamicModule, Module, Provider } from "@nestjs/common";
import {createTransport } from "nodemailer";
import { MAILER_CLIENT } from "src/shared/constants";

@Module({})
export class MailerModule{
    constructor(){}
    static forRoot(config):DynamicModule{
        const mailer = createTransport(config);

        const mailProvider : Provider = {
            provide: MAILER_CLIENT,
            useValue: mailer,

        }
        return {
            module: MailerModule,
            providers: [mailProvider],
            exports: [mailProvider],
            global: true
        }
    }
}