import mongoose from 'mongoose'
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, QueueStatus, BadRequestError } from '@*****/common'
import { body } from 'express-validator'
import { Skill } from '../models/skill';
import { Queue } from '../models/queue';


const router = express.Router();

router.post(
  '/api/queues',
  requireAuth,
  [
    body('skillId').not().isEmpty()
      .withMessage('SkillId must be provided')
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input)
      })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { skillId } = req.body;

    // find the skill
    const skill = await Skill.findById(skillId);
    if (!skill) {
      throw new NotFoundError();
    }

    // this queue already created
    const existingQueue = await Queue.findOne({
      skill: skill,
      status: {
        $in: [
          QueueStatus.Created
        ]
      }
    })

    if (existingQueue) {
      throw new BadRequestError('Skill already added');
    }

    const queue = Queue.build({
      userId: req.currentUser!.id,
      status: QueueStatus.Created,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      skill
    })

    await queue.save();

    res.status(201).send(queue);
  }
);

export { router as newQueueRouter };
