import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }]
      };
    }
    return prisma.query.users(opArgs, info);
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    };
    if (args.query) {
      opArgs.where.OR = [
        { body_contains: args.query },
        { title_contains: args.query }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },

  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        { body_contains: args.query },
        { title_contains: args.query }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },

  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },

  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = await prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );

    if (!user) throw new Error("User not found");

    return user;
  },

  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) throw new Error("Post no found");

    return posts[0];
  }
};

export default Query;
