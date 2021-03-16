import express, { Request, Response, NextFunction } from "express";
import { param } from "express-validator";
import S3 from "aws-sdk/clients/s3";
import multer from "multer";
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  requireAuth,
  currentUser,
} from "@*****/common";

import { User } from "../models/user";

import { preRegisterAuth } from "../middlewares/pre-register-auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fields: 1,
    fileSize: 6000000,
    files: 1,
    parts: 2,
  },
});

var s3 = new S3({
  apiVersion: "2006-03-01",
  region: "us-west-2",
  credentials: {
    accessKeyId: "AKIAQC4JURCNLQED5LVA",
    secretAccessKey: "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",
  },
});

const Bucket = "*****-services";

router
  .route("/api/experts/record/:no")
  .all(
    currentUser,
    requireAuth,
    param("no").isInt({ min: 1, max: 4 }),
    validateRequest,
    preRegisterAuth
  )
  .get(getRec)
  .delete(deleteRec)
  .post(upload.single("audio"), uploadRec);

function getKey(email: string, no: Number) {
  return email + "-record-" + no + ".mp3";
}

async function deleteRec(req: Request, res: Response) {
  const no = Number(req.params.no);
  const user = req.preRegisterUser;
  if (user.records[no]) {
    const Key = getKey(user.email, no);
    let uploadParams = {
      Bucket,
      Key,
    };
    await s3.deleteObject(uploadParams).promise();

    user.records[no] = false;
    await User.findByIdAndUpdate(user._id, {
      $set: { records: user.records },
    }).exec();
  }
  res.send();
}
async function getRec(req: Request, res: Response) {
  const no = Number(req.params.no);
  const user = req.preRegisterUser;

  if (user.records[no]) {
    const Key = getKey(user.email, no);
    let uploadParams = {
      Bucket,
      Key,
    };
    const s3result = await s3.getObject(uploadParams).promise();
    return res.contentType("audio/mpeg").send(s3result.Body);
  }
  throw new NotFoundError();
}

async function uploadRec(req: Request, res: Response) {
  const no = Number.parseInt(req.params.no);
  const user = req.preRegisterUser;

  const file = req.file;

  const Key = getKey(user.email, no);
  let uploadParams = {
    Bucket,
    Key,
    Body: file.buffer,
  };
  await s3.putObject(uploadParams).promise();
  user.records[no] = true;
  await User.findByIdAndUpdate(user._id, {
    $set: { records: user.records },
  }).exec();
  res.status(201).send();
}

export { router as recordRouter };
