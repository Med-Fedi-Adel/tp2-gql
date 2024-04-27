import { Context, Cv, Skill, User } from "../types";

export const userExists = ({ users }: Context["db"], owner: string): boolean =>
  users.some((user: User) => user.id === owner);

export const skillExists = (
  { skills }: Context["db"],
  newSkillId: string
): boolean => skills.some((skill: Skill) => skill.id === newSkillId);

export const cvExists = ({ cvs }: Context["db"], cvId: string): boolean =>
  cvs.some((cv: Cv) => cv.id === cvId);
