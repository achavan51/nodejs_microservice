const apiKey = "key-d604e42284a7b770a5a786d2e8f****";
const mailgunDomain = "*****app.com";
const mailgunFrom = "*****<activate@*****app.com>";

const mailgun = require("mailgun-js")({
  apiKey,
  domain: mailgunDomain,
});

const sendMailWithMailgun = async (
  from = mailgunFrom,
  to: string,
  subject: string,
  bodyText: string,
  bodyHTML: string
): Promise<{ emailResult: any, from: string }> => {
  return new Promise((resolve, reject) => {
    if (to === undefined) {
      return reject("to must be defined.");
    }
    if (subject === undefined) {
      return reject("subject must be defined.");
    }
    if (bodyText === undefined) {
      return reject("bodyText must be defined.");
    }
    if (bodyHTML === undefined) {
      return reject("bodyHTML must be defined.");
    }

    const data = {
      from,
      to: to,
      subject: subject,
      text: bodyText,
      html: bodyHTML,
    };

    mailgun.messages().send(data, function (err: any, result: any) {
      if (err) {
        reject(err);
      } else {
        resolve({ emailResult: result, from });
      }
    });
  });
};

export default sendMailWithMailgun;
// : async (to, subject, bodyText, bodyHTML) => {
//   return new Promise((resolve, reject) => {
//     if (to === undefined) {
//       return reject("to must be defined.");
//     }
//     if (subject === undefined) {
//       return reject("subject must be defined.");
//     }
//     if (bodyText === undefined) {
//       return reject("bodyText must be defined.");
//     }
//     if (bodyHTML === undefined) {
//       return reject("bodyHTML must be defined.");
//     }

//     var data = {
//       from: mailgunFrom,
//       to: to,
//       subject: subject,
//       text: bodyText,
//       html: bodyHTML
//     };

//     mailgun.messages().send(data, function(err, result) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }
//   sendPushNotification: async (device_token, messageText, message_category) => {
//     return new Promise((resolve, reject) => {
//       if (device_token === undefined) {
//         return reject("device_token must be defined.");
//       }
//       if (messageText === undefined) {
//         return reject("messageText must be defined.");
//       }
//       if (message_category === undefined) {
//         return reject("message_category must be defined.");
//       }

//       var serverKey = settings.google_fcm.serverKey;
//       var fcm = new firebase(serverKey);

//       var message = {
//         to: device_token,
//         notification: {
//           title: "*****",
//           body: messageText
//         },
//         data: {
//           message_category: message_category
//         }
//       };
//       fcm.send(message, function(err, response) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(response);
//         }
//       });
//     });
//   },
//   sendSMS: async (phonenum, smsText) => {
//     return new Promise((resolve, reject) => {
//       if (phonenum === undefined) {
//         return reject("phonenum must be defined.");
//       }
//       if (smsText === undefined) {
//         return reject("smsText must be defined.");
//       }

//       var client = new twilio(
//         settings.sendSms.accountSid,
//         settings.sendSms.authToken
//       );
//       client.messages.create(
//         {
//           from: settings.sendSms.from,
//           to: phonenum,
//           body: smsText
//         },
//         function(err, message) {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(message);
//           }
//         }
//       );
//     });
//   },
//   sendMailWithNodemailer: async (to, subject, bodyHTML) => {
//     return new Promise((resolve, reject) => {
//       if (to === undefined) {
//         return reject("to must be defined.");
//       }
//       if (subject === undefined) {
//         return reject("subject must be defined.");
//       }

//       if (bodyHTML === undefined) {
//         return reject("bodyHTML must be defined.");
//       }
//       var transporter = nodemailer.createTransport({
//         host: settings.smtp01.host,
//         port: settings.smtp01.port,
//         secure: settings.smtp01.secure,
//         auth: {
//           user: settings.smtp01.user,
//           pass: settings.smtp01.password
//         },
//         tls: {
//           rejectUnauthorized: settings.smtp01.rejectUnauthorized
//         }
//       });

//       var mailOptions = {
//         from: settings.smtp01.from,
//         xMailer: false,
//         to: to,
//         subject: subject,
//         html: bodyHTML
//       };

//       transporter.sendMail(mailOptions, function(err, result) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//   }
// };
