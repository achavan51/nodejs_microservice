import express, { Request, Response } from "express";
import { requireAuth } from "@*****/common";
import { Quiz } from "../models/quiz";

const router = express.Router();

router.get("/api/quizes", async (req: Request, res: Response) => {
  await Quiz.find()
    .then((quiz) => {
      res.send(quiz);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

export { router as indexQuizRouter };
