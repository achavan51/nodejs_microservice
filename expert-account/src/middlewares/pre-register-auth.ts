import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotAuthorizedError } from "@*****/common";
import { User, UserDoc } from "../models/user";
import { EmailNotVerifiedError } from "../errors/email-not-verified-error";

declare global {
  namespace Express {
    interface Request {
      preRegisterUser: UserDoc;
    }
  }
}

export const preRegisterAuth = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = req.currentUser?.email;
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotAuthorizedError();
  }
  if (!user.emailVerified) {
    throw new EmailNotVerifiedError();
  }
  if (user.registered) {
    throw new BadRequestError("User already registered");
  }

  req.preRegisterUser = user;
  next();
};
