import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  requirePartner
} from '@*****/common'
import { Skill } from '../models/skill'
import { SkillUpdatedPublisher } from '../events/publishers/skill-updated-publisher';
import { natsWrapper } from "@*****/common";

const router = express.Router();

router.put(
  '/api/skills/custom/:skillId',
  requireAuth,
  requirePartner,
  [
    body('name')
      .notEmpty()
      .withMessage('Skill name is required'),
    body('rate')
      .isFloat({ gt: 0 })
      .withMessage('Rate must be provieded and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      throw new NotFoundError();
    }

    if (skill.companyId !== req.currentUser!.companyId) {
      throw new NotAuthorizedError();
    }

    skill.set({
      title: req.body.title,
      rate: req.body.rate
    })
    await skill.save();
    new SkillUpdatedPublisher(natsWrapper.client).publish({
      id: skill.id,
      name: skill.name,
      code: skill.code,
      rate: skill.rate,
      companyId: skill.companyId,
      version: skill.version
    })

    res.send(skill);
  }
);

export { router as updateSkillRouter };