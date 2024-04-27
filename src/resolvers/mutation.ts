import { GraphQLError } from "graphql";
import { Context, Cv, CvWithSkills, MutationType } from "../types";
import { cvExists, skillExists, userExists } from "../utils";
import { PubSubEvents } from "../pubsub";

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
  addCv: (
    _: unknown,
    { addCvInput }: AddCvArgs,
    { db, pubSub }: Context
  ): CvWithSkills => {
    if (!userExists(db, addCvInput.owner)) {
      throw new GraphQLError(`There is no user with id ${addCvInput.owner}`);
    }

    for (const skillId of addCvInput.skills) {
      console.log(skillId);
      if (!skillExists(db, skillId)) {
        throw new GraphQLError(`There is no skill with id ${skillId}`);
      }
    }

    const newCv = {
      id: (+db.cvs[db.cvs.length - 1].id + 1).toString(),
      ...addCvInput,
    };
    db.cvs.push(newCv);
    db.cvSkills.push(
      ...addCvInput.skills.map((skillId: string) => ({
        cvId: newCv.id,
        skillId,
      }))
    );
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: { mutation: MutationType.ADD, cv: newCv },
    });

    return newCv;
  },

  updateCv: (
    _: unknown,
    { updateCvInput, id }: UpdateCvArgs,
    { db, pubSub }: Context
  ): CvWithSkills => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }

    if (updateCvInput.owner && !userExists(db, updateCvInput.owner)) {
      throw new GraphQLError(`There is no user with id ${updateCvInput.owner}`);
    }

    for (const skillId of updateCvInput.skills || []) {
      if (!skillExists(db, skillId)) {
        throw new GraphQLError(`There is no skill with id ${skillId}`);
      }
    }

    let cvIndex = db.cvs.findIndex((cv: Cv) => cv.id === id);

    db.cvs[cvIndex] = {
      ...db.cvs[cvIndex],
      ...updateCvInput,
    };

    if (updateCvInput.skills) {
      db.cvSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId !== id);
      db.cvSkills.push(
        ...updateCvInput.skills.map((skillId: string) => ({
          cvId: id,
          skillId,
        }))
      );
    }

    const updateCv = db.cvs[cvIndex];
    const returnedCv = {
      ...updateCv,
      skills: db.cvSkills
        .filter((cvSkill) => cvSkill.cvId === id)
        .map((cvSkill) => cvSkill.skillId),
    };

    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.UPDATE,
        cv: returnedCv,
      },
    });
    return returnedCv;
  },

  deleteCv: (
    _: unknown,
    { id }: DeleteCvArgs,
    { db, pubSub }: Context
  ): CvWithSkills => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }
    const relatedSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId === id);
    db.cvSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId !== id);
    const deletedCvIndex = db.cvs.findIndex((cv: Cv) => cv.id === id);
    const deletedCv = db.cvs.splice(deletedCvIndex, 1)[0];
    const returnedCv = {
      ...deletedCv,
      skills: relatedSkills.map((cvSkill) => cvSkill.skillId),
    };
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.DELETE,
        cv: returnedCv,
      },
    });
    return returnedCv;
  },
};
