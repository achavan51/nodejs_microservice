import { CustomError } from "@*****/common";

export class EmailNotVerifiedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Email not verified");

    Object.setPrototypeOf(this, EmailNotVerifiedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
