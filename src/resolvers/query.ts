import { GraphQLError } from "graphql";
import { Context, Cv, CvWithSkills } from "../types";
import { cvExists } from "../utils";

type GetCvByIdArgs = {
  id: string;
};

export const Query = {
  getAllCv: (_: unknown, _1: {}, { db }: Context): CvWithSkills[] => {
    const cvs = db.cvs;
    return cvs.map((cv: Cv) => ({
      ...cv,
      skills: db.skills.reduce((acc, skill) => {
        if (
          db.cvSkills.find(
            (cvSkill) => cvSkill.cvId === cv.id && cvSkill.skillId === skill.id
          )
        ) {
          acc.push(skill.id);
        }
        return acc;
      }, [] as string[]),
    }));
  },
  getCvByID: (
    _: unknown,
    { id }: GetCvByIdArgs,
    { db }: Context
  ): CvWithSkills => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`Cv with id ${id} not found`);
    }

    const cv = db.cvs.find((cv: Cv) => cv.id === id)!;
    const skills = db.cvSkills.filter((cvSkill) => cvSkill.cvId === id);

    return { ...cv, skills: skills.map((cvSkill) => cvSkill.skillId) };
  },
};
