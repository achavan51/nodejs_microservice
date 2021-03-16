import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpertAccountCreatedEvent,
} from "@*****/common";

import { Email } from "../../models/email";
import { queueGroupName } from "./queue-group-name";
import sendMailWithMailgun from "../../services/email";

import fs from "fs";

const htmlToText = require("html-to-text");

export class ExpertAccountCreatedListener extends Listener<
  ExpertAccountCreatedEvent
  > {
  readonly subject = Subjects.ExpertAccountCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpertAccountCreatedEvent["data"], msg: Message) {
    // const { id, email, registerToken, registerTokenCreatedAt } = data;

    console.log(__dirname, "some data come:", data);

    const baseUrl = "https://expert.*****.io/verify/";

    const to = data.email;
    const registerToken = data.registerToken;
    const url = `${baseUrl}email=${to}&verify=${registerToken}`;

    const subject = "Confirm E-Mail";

    console.log(__dirname);
    fs.readFile(
      __dirname + "/../../templates/signup.html",
      { encoding: "utf8" },
      async (err, bodyHTML) => {
        if (err) {
          console.log("email template file not read", __dirname, err);
          throw err;
        }

        const name = to.substr(0, to.indexOf("@"));
        const mapObj: any = {
          "%name%": name,
          "%url%": url,
        };

        const regex = new RegExp(Object.keys(mapObj).join("|"), "gi");

        bodyHTML = bodyHTML.replace(regex, function (matched) {
          return mapObj[matched];
        });

        const bodyText: string = htmlToText.fromString(bodyHTML, {
          wordwrap: 130,
        });
        //console.log(text); // Hello World
        //   const content = `Hi,
        // Thanks for your interest.
        // Please confirm your email by clicking on the button below;
        // <a href="${url}">Click here</a>
        // You can also copy the link below to your browser;
        // ${url}`

        const { from } = await sendMailWithMailgun(
          undefined,
          to,
          subject,
          bodyText,
          bodyHTML
        );

        // console.log("email result", emailResult);
        const email = Email.build({
          from,
          to,
          subject,
          bodyText,
          bodyHTML,
        });
        await email.save();
        msg.ack();
      }
    );
  }
}
