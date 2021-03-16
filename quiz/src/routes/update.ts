import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@*****/common";
import { Quiz } from "../models/quiz";

const router = express.Router();

router.put(
  "/api/quizes/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    Quiz.findByIdAndUpdate(id, req.body)
      .then((response) => {
        if (response !== null) {
          console.log("Res", response);
          res.send(response);
        } else {
          res.status(400).send({
            message: `Can not find Quiz with given id ${req.params.id}. Quiz was not found!`,
          });
        }
      })
      .catch((err) => {
        console.log("errr", err);
        res.status(400).send({
          message: err.message || "Some error occurred while retrieving data.",
        });
      });
  }
);

export { router as updateQuizRouter };
