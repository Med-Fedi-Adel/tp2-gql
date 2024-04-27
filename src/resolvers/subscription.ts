import { subscribe } from "diagnostics_channel";
import { PubSubEvents } from "../pubsub";
import { Context } from "../types";

export const Subscription = {
  notifyCv: {
    subscribe: (_: unknown, __: {}, { pubSub }: Context) =>
      pubSub.subscribe(PubSubEvents.NOTIFY),
  },
};
