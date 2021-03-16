import express, { Request, Response } from "express";
import { body } from "express-validator";
import _ from "lodash";
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  currentUser,
  requireAuth,
} from "@*****/common";

import { User } from "../models/user";
import { preRegisterAuth } from "../middlewares/pre-register-auth";

const router = express.Router();

/*
{
  "firstName":"hakan",
  "lastName":"erdem",
  "birthday":"23-06-1993",
  "mobilePhone":"0554 972 31 24",
  "nickname":"het",
  "gender":"male",
  "nationality":"Georgia",
  "countryResidence":"Georgia",
  "experienceItems":[
      {"jobTitle":"exp1","startOfWork":"2020-08-13T21:00:00.000Z","endOfWork":"2020-08-02T21:00:00.000Z"},
      {"jobTitle":"exp2","startOfWork":"2020-08-04T21:00:00.000Z","endOfWork":"2020-08-02T21:00:00.000Z"},
      {"jobTitle":"","startOfWork":"","endOfWork":""}
  ],
  "workedBefore":true,
  "tellUsExperience":"so much exp",
  "openVideo":true,
  "selectedSkillType":["Standart","Enhanced"],
}
*/

router.post(
  "/api/experts",
  currentUser,
  requireAuth,
  [
    // body("email")
    //   .isEmail()
    //   .withMessage("Email must be valid")
    //   .notEmpty()
    //   .withMessage("Email is required")
    //   .not()
    //   .isArray(),
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First ame is required")
      .not()
      .isArray(),
    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .not()
      .isArray(),
    body("birthday").trim().notEmpty().isDate(),
    body("mobilePhone")
      .trim()
      .notEmpty()
      .withMessage("Mobile phone is required"),
    // .isMobilePhone("any", { strictMode: false })
    // .withMessage("Mobile phone must be in international format"),
    body("nickname")
      .trim()
      .notEmpty()
      .withMessage("Nickname is required")
      .not()
      .isArray(),
    body("nationality")
      .trim()
      .notEmpty()
      .withMessage("Nationality is required")
      .not()
      .isArray(),
    body("countryResidence")
      .trim()
      .notEmpty()
      .withMessage("Country residence is required")
      .not()
      .isArray(),
    body("workedBefore").isBoolean(),
    body("openVideo").isBoolean(),
    body("selectedSkillType").isArray(),
  ],
  validateRequest,
  preRegisterAuth,
  async (req: Request, res: Response) => {
    // const { email, firstName, lastName, birthday, mobilePhone, nickname, gender, nationality, countryResidence } = req.body;

    delete req.body.email;
    delete req.body._id;
    delete req.body.id;
    delete req.body.emailVerified;
    delete req.body.registered;

    const user = req.preRegisterUser;

    const id = user._id;

    let preSaveUser = user.toJSON();

    preSaveUser = _.merge(preSaveUser, req.body)

    preSaveUser.registered = true;

    delete preSaveUser._id;

    await User.findByIdAndUpdate(id, preSaveUser, {
      new: true,
    }).exec();

    delete preSaveUser.registerTokenCreatedAt;
    delete preSaveUser.registerToken;

    res.status(201).send(preSaveUser);
  }
);

export { router as registerRouter };
