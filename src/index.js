import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import prisma from "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  context: {
    db,
    pubsub,
    prisma
  },
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  }
});

server.start(() => console.log("Server is up"));
