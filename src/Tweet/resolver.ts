import { Tweet } from "@prisma/client";
import prisma from "../clientdb"
import { GraphQlserver } from "../type/type";

interface TweetPayload {
    content : string,
}

const Query = {
  getAllTweets : () => {
    return prisma.tweet.findMany({});
  }
}
const Extraresolver = {
  Tweet : {
    author : (parent :  Tweet) => {
      return  prisma.user.findUnique({where : {id : parent.authorId}});
    },
  },
}
const Mutation = {
      createTweet: async (parent: any , {payload}:{payload:TweetPayload}, ctx:GraphQlserver) => {
        if(!ctx.user){ throw new Error("Authentication not done yet");}
        const newTweet = await prisma.tweet.create({
           data:{
            content : payload.content,
            author: {connect : {id : ctx.user.id}},
           }
        });

        return newTweet;
      }
}

export const resolvers = {Mutation,Extraresolver,Query}