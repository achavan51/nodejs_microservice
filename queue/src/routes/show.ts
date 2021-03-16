import express, { Request, Response } from 'express';
import {
  requireAuth, NotFoundError, NotAuthorizedError
} from '@*****/common'
import { Queue } from '../models/queue';

const router = express.Router();

router.get('/api/queues/:queueId', requireAuth, async (req: Request, res: Response) => {
  const queue = await Queue.findById(req.params.queueId).populate('skill');

  if (!queue) {
    throw new NotFoundError();
  }
  if (queue.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(queue);
});

export { router as showQueueRouter };
