import { PubSub } from "graphql-yoga";
import { Cv, CvSkill, CvSubscriptionReturn, Skill, User } from "./";
import { PubSubChannels } from "../pubsub";

export type Context = {
  db: {
    users: User[];
    cvs: Cv[];
    skills: Skill[];
    cvSkills: CvSkill[];
  };
  pubSub: PubSub<PubSubChannels>;
};
