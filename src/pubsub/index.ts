import { createPubSub } from "graphql-yoga";
import { CvSubscriptionReturn } from "../types";

export enum PubSubEvents {
  NOTIFY = "NOTIFY",
}

export type PubSubChannels = {
  NOTIFY: [{ notifyCv: CvSubscriptionReturn }];
};

export const pubSub = createPubSub<PubSubChannels>();
