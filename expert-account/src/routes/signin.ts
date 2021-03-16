import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError, AccountType } from "@*****/common";

import { Password } from "../services/password";
import { User } from "../models/user";
// import { EmailNotVerifiedError } from "../errors/email-not-verified-error";

const router = express.Router();

router.post(
  "/api/experts/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    // if (!existingUser.emailVerified) {
    //   // throw new BadRequestError("Invalid Credentials");
    //   // throw new EmailNotVerifiedError();
    // }

    const registered = existingUser.registered;
    const emailVerified = existingUser.emailVerified;
    const basicTrainingCompleted = existingUser.basicTrainingCompleted;

    // Generate JWT
    const expiresIn = 3600;
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email,
        registered,
        emailVerified,
        accountType: AccountType.Expert
      },
      process.env.JWT_KEY!,
      { expiresIn }
    );

    const userObj = {
      email,
      registered,
      emailVerified,
      basicTrainingCompleted
    };

    res.status(200).send({ ...userObj, token: userJwt });
  }
);

export { router as signinRouter };
