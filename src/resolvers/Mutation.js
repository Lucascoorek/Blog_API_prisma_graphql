import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 char long");
    }
    const password = await bcrypt.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret")
    };
  },

  async login(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({
      where: { email: data.email }
    });
    if (!user) throw new Error("Invalid credentials");
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret")
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },

  createPost(
    parent,
    { data: { title, published, body } },
    { prisma, request },
    info
  ) {
    const userId = getUserId(request);
    return prisma.mutation.createPost(
      {
        data: {
          title,
          published,
          body,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });

    if (!postExists) throw new Error("Unable to delete post");

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!postExists) throw new Error("Unable to update post");

    return prisma.mutation.updatePost(
      {
        data,
        where: {
          id
        }
      },
      info
    );
  },

  createComment(parent, { data: { text, post } }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: post
            }
          }
        }
      },
      info
    );
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) throw new Error("Unable to delete comment");

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) throw new Error("Unable to update comment");

    return prisma.mutation.updateComment(
      {
        where: {
          id
        },
        data
      },
      info
    );
  }
};

export default Mutation;
