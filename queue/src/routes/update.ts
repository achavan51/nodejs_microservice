import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  QueueStatus,
} from '@*****/common';
import { Queue } from '../models/queue';


const router = express.Router();

router.put('/api/queues/:queueId', requireAuth, async (req: Request, res: Response) => {
  const { queueId, skill } = req.params;

  const queue = await Queue.findById(queueId);

  if (!queue) {
    throw new NotFoundError();
  }
  if (queue.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  queue.set({
    userId: req.currentUser!.id,
    status: QueueStatus.Created,
    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    skill
  });

  await queue.save();

  res.status(200).send(queue);
});

export { router as updateQueueRouter };
