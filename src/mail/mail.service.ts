import { Inject, Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as path from "path";
import { MAILER_CLIENT } from "src/shared/constants";


@Injectable()
export class MailService {
    constructor(@Inject(MAILER_CLIENT) private mailer) { }

    getTemplate(template) {
        let source = fs.readFileSync(path.join(__dirname, 'templates', `${template}.hbs`), 'utf8');
        return Handlebars.compile(source);
    }


    sendMail(options) {
        if (!(options.to && options.data && options.subject && options.template)) {
            throw new Error("invalid format")
        }

        let html = this.getTemplate(options.template);
        let mailOptions = {
            from: "do-not-reply@unavagam.com",
            to: options.to,
            subject: options.subject,
            html: html(options.data),
            replyTo: "jebulin3@gmail.com"
        }

        if (options.attachment) {
            mailOptions['attachments'] = options.attachment
        }

        try {
            return this.mailer.sendMail(mailOptions);
        } catch (err) {
            console.log(11111111,err);
            throw new Error("Sending mail faile d");
        }
    }
}