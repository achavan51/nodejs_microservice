import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from "@*****/common";
import { body } from "express-validator";
import { Quiz } from "../models/quiz";

const router = express.Router();

router.post("/api/quiz", async (req: Request, res: Response) => {
  // this Quiz already created
  await Quiz.create(req.body)
    .then((quiz) => {
      res.send(quiz);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

export { router as newQuizRouter };
