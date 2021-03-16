import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  BadRequestError,
  AccountType,
} from '@*****/common';

import { User } from "../models/user";

const router = express.Router();

router.post(
  '/api/partners/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const accountType = AccountType.Partner;
    const user = User.build({ email, password, accountType });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        accountType: user.accountType
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    // req.session = {
    //   jwt: userJwt,
    // };

    // TODO: send email

    res.status(201).send(user);
  }
);

export { router as signupRouter };
