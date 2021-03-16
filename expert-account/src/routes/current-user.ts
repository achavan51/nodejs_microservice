import express from 'express';
import { currentUser, requireAuth } from '@*****/common';

const router = express.Router();

router.get('/api/experts/currentuser', currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
