import { Cv, CvWithSkills } from "./Cv";

export enum MutationType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export type CvSubscriptionReturn = {
  cv: any;
  mutation: MutationType;
};
