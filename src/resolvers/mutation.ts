import { GraphQLError } from "graphql";
import { Context, Cv, CvWithSkills, MutationType } from "../types";
import { cvExists, skillExists, userExists } from "../utils";
import { PubSubEvents } from "../pubsub";
import { createContext } from "../prisma-client";

type AddCvArgs = {
  addCvInput: Omit<Cv, "id"> & {
    skills: string[];
  };
};

type UpdateCvArgs = {
  id: string;
  updateCvInput: Partial<Omit<Cv, "id">> & {
    skills?: string[];
  };
};

type DeleteCvArgs = {
  id: string;
};

export const Mutation = {
  addCv: async (
    _: unknown,
    { addCvInput }: AddCvArgs,
    { db, pubSub }: Context
  ) => {
    const { prisma } = createContext();

    if (
      !(await prisma.user.findUnique({
        where: { id: parseInt(addCvInput.owner) },
      }))
    ) {
      throw new GraphQLError(`There is no user with id ${addCvInput.owner}`);
    }

    for (const skillId of addCvInput.skills) {
      if (
        !(await prisma.skill.findUnique({
          where: { id: parseInt(skillId) },
        }))
      ) {
        throw new GraphQLError(`There is no skill with id ${skillId}`);
      }
    }

    const newCv = await prisma.cv.create({
      data: {
        name: addCvInput.name,
        age: addCvInput.age,
        job: addCvInput.job,
        owner: {
          connect: { id: parseInt(addCvInput.owner) },
        },
        skills: {
          connect: addCvInput.skills.map((skillId) => ({
            id: parseInt(skillId),
          })),
        },
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

    console.log(newCv);

    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: { mutation: MutationType.ADD, cv: newCv },
    });

    return newCv;
  },

  updateCv: async (
    _: unknown,
    { updateCvInput, id }: UpdateCvArgs,
    { db, pubSub }: Context
  ) => {
    const { prisma } = createContext();

    const returnedcv = await prisma.cv.findUnique({
      where: { id: parseInt(id) },
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

    if (!returnedcv) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }

    if (
      updateCvInput.owner &&
      returnedcv.ownerId !== parseInt(updateCvInput.owner)
    ) {
      if (
        !(await prisma.user.findUnique({
          where: { id: parseInt(updateCvInput.owner) },
        }))
      ) {
        throw new GraphQLError(
          `There is no user with id ${updateCvInput.owner}`
        );
      }
    }

    if (updateCvInput.skills) {
      for (const skillId of updateCvInput.skills) {
        if (
          !(await prisma.skill.findUnique({
            where: { id: parseInt(skillId) },
          }))
        ) {
          throw new GraphQLError(`There is no skill with id ${skillId}`);
        }
      }
    }

    const updatedCv = await prisma.cv.update({
      where: { id: parseInt(id) },
      data: {
        name: updateCvInput.name,
        age: updateCvInput.age,
        job: updateCvInput.job,
        owner: {
          connect: {
            id: updateCvInput.owner
              ? parseInt(updateCvInput.owner)
              : returnedcv.ownerId,
          },
        },
        skills: {
          set: updateCvInput.skills
            ? updateCvInput.skills.map((skillId) => ({
                id: parseInt(skillId),
              }))
            : undefined,
        },
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

    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.UPDATE,
        cv: updatedCv,
      },
    });
    return updatedCv;
  },

  deleteCv: async (
    _: unknown,
    { id }: DeleteCvArgs,
    { db, pubSub }: Context
  ) => {
    const { prisma } = createContext();

    const returnedCv = await prisma.cv.findUnique({
      where: { id: parseInt(id) },
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

    if (!returnedCv) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }

    const deletedCv = await prisma.cv.delete({
      where: { id: parseInt(id) },
    });

    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.DELETE,
        cv: returnedCv,
      },
    });
    return deletedCv;
  },
};
