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
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },

  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id
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

  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  updatePost(parent, { id, data }, { prisma }, info) {
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

  createComment(parent, { data: { text, author, post } }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: author
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

  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  updateComment(parent, { id, data }, { prisma }, info) {
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
