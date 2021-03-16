import express, { Request, Response } from "express";
import { body } from "express-validator";
// import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import {
  validateRequest,
  BadRequestError,
  AccountType,
} from "@*****/common";

import { User } from "../models/user";
import { ExpertAccountCreatedPublisher } from "../events/publishers/expert-account-created-publisher"
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post(
  "/api/experts/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const registerToken: string = randomBytes(48)
      .toString("base64")
      .replace(/\//g, "")
      .replace(/\+/g, "");

    const accountType = AccountType.Expert;
    const user = User.build({
      email,
      password,
      accountType,
      registerToken,
      emailVerified: false,
    });
    await user.save();

    new ExpertAccountCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email,
      registerToken,
      registerTokenCreatedAt: user.registerTokenCreatedAt
    });

    const returnObj = {
      email: user.get("email"),
      id: user.get("id"),
      accountType: user.get("accountType"),
    };

    // console.log(returnObj)

    res.status(201).send(returnObj);
  }
);

export { router as signupRouter };
