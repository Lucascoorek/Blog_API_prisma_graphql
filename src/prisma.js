import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "jesusisalive"
});

export default prisma;

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         body: 'This is new post body',
//         published: true
//       },
//       where: {
//         id: 'ck2mafu5l000u07448qg51qxt'
//       }
//     },
//     '{id title body published}'
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.posts(null, '{title body published id}');
//   })
//   .then(data => console.log(JSON.stringify(data, undefined, 2)));

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });
//   if (!userExists) throw new Error("User not found");

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{author {id name email posts{id title published}}}"
//   );
//   return post.author;
// };
// createPostForUser("111", {
//   title: "Second New Post from async func",
//   body: "Second How to use async in prisma",
//   published: true
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err.message));

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });
//   if (!postExists) throw new Error("Post not found");
//   const post = await prisma.mutation.updatePost(
//     {
//       data,
//       where: {
//         id: postId
//       }
//     },
//     "{id title published author{id name email}}"
//   );
//   return post;
// };

// updatePostForUser("1111", {
//   published: false
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err.message));
