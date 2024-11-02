import { Controller } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    async sendEmail(payload) {
        // if (payload.to && payload.data && payload.subject && payload.template) {
            return this.mailService.sendMail(payload)
        // }
        // throw new Error("invalid format")
    }
}