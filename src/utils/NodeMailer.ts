require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";

export class NodeMailer {
  private static initiateTransport() {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    return transporter;
  }

  static async sendMail(data: { to: [string]; subject: string; html: string }) {
    await NodeMailer.initiateTransport().sendMail({
      from: process.env.SMTP_MAIL,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
