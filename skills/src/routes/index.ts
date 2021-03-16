import express, { Request, Response } from "express";
// import _, { isObject } from "lodash";
import { Company } from "../models/company";
import { Skill, SkillDoc } from "../models/skill";
import { UserSkill, UserSkillDoc } from "../models/user-skill";
import { Expert } from "../models/expert";
import { AccountType, SkillType, requireAuth } from "@*****/common";
import { UserPayload } from "@*****/common/build/middlewares/types/user-payload";
const router = express.Router();

function getSkills(skills: SkillDoc[], userSkills: UserSkillDoc[]) {
  let skillsJson: Array<any> = [];
  for (let index = 0; index < skills.length; index++) {
    const s = skills[index];

    let obj = {
      enrolled: false,
      completed: false,
      code: s.code,
      name: s.name,
      id: s.id.toString(),
      company: s.get("company"),
    };

    userSkillLoop: for (let j = 0; j < userSkills.length; j++) {
      const us = userSkills[j];
      if (s.id == us.skillId) {
        console.log("s", s);
        obj.enrolled = true;
        obj.completed = us.completed;
        break userSkillLoop;
      }
    }
    skillsJson.push(obj);
  }
  return skillsJson;
}

router.get(
  "/api/skills/basic",
  requireAuth,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser;
    const accountType = currentUser?.accountType;

    const skills = await Skill.find({ skillType: SkillType.Common });

    const userSkills = await UserSkill.find({ userId: currentUser!.id });
    let skillsJson: Array<any> = getSkills(skills, userSkills);

    // console.log("ski", skillsJson);
    return res.send(skillsJson);
  }
);

router.get(
  "/api/skills/custom",
  requireAuth,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser;
    const accountType = currentUser?.accountType;
    // console.log("account type", accountType);
    Company.findOne();

    if (accountType == AccountType.Expert) {
      const skillType = SkillType.Custom;
      let skills = await Skill.find({ skillType }).populate("company");

      const userSkills = await UserSkill.find({ userId: currentUser!.id });
      let skillsJson: Array<any> = getSkills(skills, userSkills);

      // console.log("ski", skillsJson);
      return res.send(skillsJson);
    }

    let skills: SkillDoc[];
    if (accountType === AccountType.Partner) {
      skills = await Skill.find({
        companyId: req.currentUser?.companyId,
      }).exec();
    } else {
      skills = [];
    }

    res.send(skills);
  }
);

export { router as indexSkillRouter };
