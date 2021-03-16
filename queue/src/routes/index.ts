import express, { Request, Response } from 'express'
import { requireAuth } from '@*****/common';
import { Queue } from '../models/queue'

const router = express.Router();

router.get('/api/queues', requireAuth, async (req: Request, res: Response) => {
  const queue = await Queue.find({
    userId: req.currentUser!.id
  }).populate('skill')

  res.send({});
});


export { router as indexQueueRouter };