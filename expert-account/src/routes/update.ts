import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  BadRequestError,
  CustomError,
} from "@*****/common";

import { User, UserDoc } from "../models/user";
import { Password } from "../services/password";
import { EmailNotVerifiedError } from "../errors/email-not-verified-error";

const router = express.Router();

router.put(
  "/api/experts",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
    body("newPassword")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("New password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, newPassword, updateType } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    if (updateType !== "password") {
      throw new BadRequestError("Unknown update type");
    }

    try {
      await updatePassword(existingUser, password, newPassword);
      res.status(201).send();
    } catch (err) {
      throw err;
    }
  }
);

const updatePassword = async (
  user: UserDoc,
  password: string,
  newPassword: string
) => {
  const passwordsMatch = await Password.compare(user.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid Credentials");
  }

  if (!user.emailVerified) {
    throw new EmailNotVerifiedError();
  }

  user.password = newPassword;
  await user.save();
};

export { router as updateRouter };
