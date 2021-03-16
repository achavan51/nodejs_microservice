import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@*****/common";
import { Quiz } from "../models/quiz";

const router = express.Router();

router.get(
  "/api/quizes/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    // 1. Check usage of await
    // 2. throw NotFoundError
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new NotFoundError();
    }
    res.send(quiz);
  }
);

export { router as showQuizRouter };
