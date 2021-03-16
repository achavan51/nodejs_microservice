import express, { Request, Response } from "express";
import { Skill } from "../models/skill";
import { NotFoundError } from "@*****/common";

const router = express.Router();

router.get("/api/skills/custom/:id", async (req: Request, res: Response) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new NotFoundError();
  }

  res.send(skill);
});

export { router as showSkillRouter };
