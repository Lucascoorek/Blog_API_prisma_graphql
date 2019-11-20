const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      };
    }
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{ body_contains: args.query }, { title_contains: args.query }]
      };
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me() {
    return {
      name: "LUKASZ",
      id: "123adc",
      age: 23,
      email: "lukasz@gmail.com"
    };
  },
  post() {
    return {
      id: "456asd",
      title: "Post title",
      body: "Some post body...",
      published: true
    };
  }
};

export default Query;
