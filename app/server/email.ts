"use server";

import { tEmail } from "./data/email-data";
import * as nodemailer from "nodemailer";
import { fillTemplate, loadTemplateByName } from "./templates";
import { tTemplate } from "@/lib/prisma-types";

export const sendEmail = async (_email: tEmail): Promise<tEmail | null> => {
  let _emailSend: tEmail | null = null;

  if (_email.destination) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    try {
      if (_email.content) {
        await transporter
          .sendMail({
            from: process.env.GMAIL_FROM, // sender address
            to: _email.destination, // list of receivers
            subject: "TEST",
            html: _email.asHTML
              ? // ? await fillTemplate(_email.content, _email.params)
                _email.content
              : "",
          })
          .then(() => (_emailSend = _email))
          .catch((error: any) => console.log("EMAIL ERROR", error));
      } else {
        await loadTemplateByName(_email.template).then(
          async (value: tTemplate | undefined) => {
            if (value) {
              await transporter
                .sendMail({
                  from: process.env.GMAIL_FROM, // sender address
                  to: _email.destination, // list of receivers
                  subject: value.description ?? undefined,
                  text: _email.asHTML
                    ? ""
                    : await fillTemplate(value.content, _email.params),
                  html: _email.asHTML
                    ? await fillTemplate(value.content, _email.params)
                    : "",
                })
                .then(() => (_emailSend = _email))
                .catch((error: any) => console.log("EMAIL ERROR", error));
            }
          }
        );
      }
    } catch (err) {
      _emailSend = null;
    }
  }

  return _emailSend;
};
