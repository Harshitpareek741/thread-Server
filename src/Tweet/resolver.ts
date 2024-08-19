import { Tweet } from "@prisma/client";
import prisma from "../clientdb"
import { GraphQlserver } from "../type/type";
import TweetService from "../services/tweet";

interface TweetPayload {
    content : string,
    imageUrl : string
}

const Query = {
  getAllTweets : () => {
    return prisma.tweet.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
  getPresignurl : async (parent : any , {imagetype, imageName }: {imagetype : string , imageName : string }, ctx: GraphQlserver ) => {
    const ids = ctx.user?.id;
    return await TweetService.getPresignedurl(imageName,imagetype,ids || "");
  },
  getLikes : async (parent : any , {tweetId} : {tweetId : string}) => {
     const tweet = await prisma.tweet.findUnique({where : {id : tweetId}});
     return tweet?.likes; 
  },
  getCommnets : (parent : any , {tweetId}: {tweetId : string}) => {
    const tweet =  prisma.tweet.findUnique({where : {id : tweetId}});
    return tweet.comments;
  },
  getRetweet : async (parent : any , {tweetId}: {tweetId : string} ) => {
     const post = await prisma.tweet.findUnique({where :{id : tweetId}});
     return post?.retweet;
  },
  getViews : async (parent : any , {tweetId} : {tweetId : string}) => {
    const views = await prisma.tweet.findUnique({where : {id : tweetId}});
    return views?.views;
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
        const ids = ctx.user?.id;
       return await TweetService.createTweet(payload,ids || "");
      },
      createlike : async (parent : any , {tweetId} : {tweetId : string}, ctx : GraphQlserver) => {
         const tweet = await prisma.tweet.update({
          where : {id : tweetId},
          data : {
            likes : {
              increment : 1,
            }
          }
         })
         return true;
      },

      createRetweet : async (parent : any ,{tweetId} : {tweetId : string},ctx : GraphQlserver) => {
         const post = await prisma.tweet.findUnique({
          where : {id : tweetId}
         });
         const ts = await prisma.tweet.update({
          where : {id : tweetId},
          data : {
            retweet : {
              increment : 1,
            }
          }
         });
   
         const ids = ctx.user?.id;
         const payload = { content : post?.content || "" , 
                        imageUrl : post?.imageUrl  || ""
         };
        
        return   await TweetService.createTweet(payload,ids || "");
       
      },
      createViews : async (parent : any , {tweetId } : {tweetId : string},ctx:GraphQlserver) => {
        const tweet = await prisma.tweet.update({
          where : {id : tweetId},
          data : {
            views : {
              increment : 1,
            }
          }
         })
         return true;
      }
}

export const resolvers = {Mutation,Extraresolver,Query}