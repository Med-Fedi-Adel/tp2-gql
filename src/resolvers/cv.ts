import { GraphQLError } from "graphql";
import {
  Context,
  CvSkill,
  Cv as CvType,
  CvWithSkills,
  Skill,
  User,
} from "../types";

export const Cv = {
  owner: ({ owner }: CvType, _: {}, { db }: Context) => {
    // console.log("HERE IS THE OWNER", owner);

    return owner;
  },

  skills: ({ id, skills }: CvWithSkills, _: {}, { db }: Context) => {
    return skills;
  },
};
