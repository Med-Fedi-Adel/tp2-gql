import { createServer } from "http";
import { schema } from "./schema";
import { db } from "./db/db";
import { pubSub } from "./pubsub";
import { createYoga } from "graphql-yoga";
import { createContext } from "./prisma-client";

async function main() {
  const yoga = createYoga({ schema, context: { db, pubSub, createContext } });
  const server = createServer(yoga);

  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
