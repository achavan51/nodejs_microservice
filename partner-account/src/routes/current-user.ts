import express from 'express';
import { currentUser } from '@*****/common';

const router = express.Router();

router.get('/api/partners/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
