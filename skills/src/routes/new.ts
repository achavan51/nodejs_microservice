import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  requirePartner,
  validateRequest,
  SkillType,
} from "@*****/common";
import { Skill } from "../models/skill";
import { UserSkill } from "../models/user-skill";
import { SkillCreatedPublisher } from "../events/publishers/skill-created-publisher";
import { natsWrapper } from "@*****/common";

const router = express.Router();

router.post(
  "/api/skills",
  requireAuth,
  requirePartner,
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("code").not().isEmpty().withMessage("Code is required"),
    body("rate").isFloat({ gt: 0 }).withMessage("Rate must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("account type: ", req.currentUser?.accountType);

    const { name, code, rate } = req.body;
    const skill = Skill.build({
      code,
      name,
      rate,
      skillType: SkillType.Custom,
      companyId: req.currentUser!.companyId,
    });
    await skill.save();

    // TODO change title to name etc
    new SkillCreatedPublisher(natsWrapper.client).publish({
      id: skill.id,
      name: skill.name,
      code: skill.code,
      rate: skill.rate,
      companyId: skill.companyId,
      version: skill.version,
    });

    res.status(201).send(skill);
  }
);

export { router as createSkillRouter };
