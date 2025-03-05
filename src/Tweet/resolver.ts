import { Like, Tweet } from "@prisma/client";
import prisma from "../clientdb";
import { GraphQlserver } from "../type/type";
import TweetService from "../services/tweet";

interface TweetPayload {
  content: string;
  imageUrl: string;
}

const Query = {
  getAllTweets: () => {
    return prisma.tweet.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        likedBy: true,
        comments: true,
        retweets: true,
      },
    });
  },
  getPresignurl: async (
    parent: any,
    { imagetype, imageName }: { imagetype: string; imageName: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    return await TweetService.getPresignedurl(imageName, imagetype, userId || "");
  },
  getLikes: async (parent: any, { tweetId }: { tweetId: string }) => {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      include: { likedBy: true },
    });
    return tweet?.likedBy;
  },
  getComments: async (parent: any, { tweetId }: { tweetId: string }) => {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      include: { comments: true },
    });
    return tweet?.comments;
  },
  getRetweet: async (parent: any, { tweetId }: { tweetId: string }) => {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      include: { retweets: true },
    });
    return tweet?.retweets;
  },
  getViews: async (parent: any, { tweetId }: { tweetId: string }) => {
    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId } });
    return tweet?.views;
  },
};

const Extraresolver = {
  Tweet: {
    author: (parent: Tweet) => {
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
  },
  Like : {
    user : (parent : Like) => {
      return prisma.user.findUnique({where : {id : parent.userId}})
    }
  }
};

const Mutation = {
  createTweet: async (
    parent: any,
    { payload }: { payload: TweetPayload },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    return await TweetService.createTweet(payload, userId);
  },

  createLike: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    try {
      await prisma.like.create({
        data: {
          tweet: { connect: { id: tweetId } },
          user: { connect: { id: userId } },
        },
      });
      return true;
    } catch (error) {
      throw new Error("Already liked or error creating like");
    }
  },

  deleteLike: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    // Delete using deleteMany to handle composite unique keys
    await prisma.like.deleteMany({
      where: {
        tweetId,
        userId,
      },
    });
    return true;
  },

  createComment: async (
    parent: any,
    { tweetId, description }: { tweetId: string; description: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    console.log(userId);
    if (!userId) throw new Error("Not authenticated");
    return await prisma.comment.create({
      data: {
        tweet: { connect: { id: tweetId } },
        user: { connect: { id: userId } },
        description,
      },
    });
  },

  deleteComment: async (
    parent: any,
    { commentId }: { commentId: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId)
      throw new Error("Not authorized to delete this comment");
    await prisma.comment.delete({ where: { id: commentId } });
    return true;
  },

  createRetweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    try {
      await prisma.retweet.create({
        data: {
          tweet: { connect: { id: tweetId } },
          user: { connect: { id: userId } },
        },
      });
      return true;
    } catch (error) {
      throw new Error("Already retweeted or error creating retweet");
    }
  },

  deleteRetweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphQlserver
  ) => {
    const userId = ctx.user?.id;
    if (!userId) throw new Error("Not authenticated");
    await prisma.retweet.deleteMany({
      where: {
        tweetId,
        userId,
      },
    });
    return true;
  },

  createViews: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphQlserver
  ) => {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return true;
  },
};

export const resolvers = { Query, Mutation, Extraresolver };
