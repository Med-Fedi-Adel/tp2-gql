import { GraphQLError } from "graphql";
import { Context, Cv, CvWithSkills } from "../types";
import { cvExists } from "../utils";
import { createContext } from "../prisma-client";

type GetCvByIdArgs = {
  id: string;
};

export const Query = {
  getAllCv: async (_: unknown, _1: {}, { db }: Context) => {
    const { prisma } = createContext();
    const allCvs = await prisma.cv.findMany({
      include: {
        owner: true,
        skills: {
          select: {
            id: true,
            designation: true,
          },
        },
      },
    });

    // console.log(allCvs);

    return allCvs;
  },
  getCvByID: async (_: unknown, { id }: GetCvByIdArgs, { db }: Context) => {
    // console.log("HELLO WORLD");
    // console.log(id);
    const { prisma } = createContext();
    const ID = parseInt(id);
    const cv = await prisma.cv.findUnique({
      where: {
        id: ID,
      },
      include: {
        owner: true,
        skills: {
          select: {
            id: true,
            designation: true,
          },
        },
      },
    });

    if (!cv) {
      throw new GraphQLError(`Cv with id ${id} not found`);
    }

    return cv;
  },
};
