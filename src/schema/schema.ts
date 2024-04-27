import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { resolvers } from "../resolvers";

const typeDefinitions = readFileSync("src/schema/schema.graphql", "utf8");

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
