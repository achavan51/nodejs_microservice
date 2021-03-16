import express, { Request, Response } from "express";
import { body } from "express-validator";
import moment from "moment";
import jwt from "jsonwebtoken";

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  requireAuth,
  currentUser,
} from "@*****/common";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/experts/verify",
  currentUser,
  requireAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
      .notEmpty()
      .withMessage("Email is required")
      .not()
      .isArray(),
    body("verify")
      .trim()
      .notEmpty()
      .withMessage("Verification code is required")
      .not()
      .isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const email = req.body.email as string;
    const verify = req.body.verify;

    const existingUser = await User.findOne({ email });

    if (!existingUser || existingUser.registerToken !== verify) {
      throw new NotFoundError();
    }

    const tokenTime = existingUser.registerTokenCreatedAt;
    const oneDayAgo = moment().add(-1, "d");
    if (oneDayAgo.isAfter(tokenTime)) {
      await existingUser.remove();
      // delete existingUser.registerToken;
      // await existingUser.save();
      throw new BadRequestError(
        "Verification time expired. Please singup again."
      );
    }

    existingUser.emailVerified = true;
    await existingUser.save();

    const expiresIn = 3600;
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email,
        registered: existingUser.registered,
        emailVerified: true,
      },
      process.env.JWT_KEY!,
      { expiresIn }
    );

    res.status(200).send({ token: userJwt });

  }
);

export { router as emailVerifyRouter };
