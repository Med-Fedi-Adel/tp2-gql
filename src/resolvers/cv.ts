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
  owner: ({ owner }: CvType, _: {}, { db }: Context): User => {
    const foundOwner = db.users.find((user: User) => user.id === owner);
    if (!foundOwner) {
      throw new GraphQLError(`User with id ${owner} not found`);
    }
    return foundOwner;
  },

  skills: ({ id, skills }: CvWithSkills, _: {}, { db }: Context): Skill[] => {
    return skills.map((skillId: string) => {
      const foundSkill = db.skills.find((skill: Skill) => skill.id === skillId);
      if (!foundSkill) {
        throw new GraphQLError(`Skill with id ${skillId} not found`);
      }
      return foundSkill;
    });
  },
};
