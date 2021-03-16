import express, { Request, Response } from "express";
import { Skill } from "../models/skill";
import { NotFoundError } from "@*****/common";
// TODO training  model

const router = express.Router();

router.route("/api/skills/training/:skillId/metarial").post(uploadMetarial);
router.route("/api/skills/training/:skillId/metarial/:no").get(downloadMetarial);

// TODO upload metarials to s3
function uploadMetarial(req: Request, res: Response) {

}

function downloadMetarial(req: Request, res: Response) {

}

export { router as trainingRouter };
