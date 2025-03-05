import axios from 'axios'
import prisma from '../clientdb';
import { createJWTToken } from '../services/service';
import { GraphQlserver } from '../type/type';
import { Console, log } from 'console';
import { User } from '@prisma/client';
import UserService from '../services/user';


interface payload {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  website: string;
}

const Query = {
  GoogleAuthentication: async (parent: any, { token }: { token: string }) => {
    return await UserService.createUserFromToken(token);
  },
  GetUserFromContext: async (parent: any, args: any, ctx: GraphQlserver) => {
    const ids = ctx.user?.id;
    const datas = await prisma.user.findUnique({ where: { id: ids } });
    return datas;
  },
  GetUserFromId: async (parent: any, { id }: { id: string }, ctx: GraphQlserver) =>
    prisma.user.findUnique({ where: { id } })
  ,
  GetAllUsers: async (parent: any, args: any, ctx: GraphQlserver) => {
    const ids = ctx.user?.id;
    const datas = await prisma.user.findMany({});
    return datas;
  }
};

const Mutation = {
  updateUser: async (parent: any, { payload }: { payload: payload }, ctx: GraphQlserver) => {
    const Userdata = await UserService.updateUser(payload);
    return Userdata;
  },
  followUser : async (parent : any , {From , To} : {From : string , To : string} , ctx : GraphQlserver) => {
     if(!ctx.user)return new Error("User Not auth");
     const follow = await UserService.followUser(From , To);
     return follow ; 
  },
  unfollowUser : async (parent : any , {From , To} : {From : string , To : string} , ctx : GraphQlserver) => {
    if(!ctx.user)return new Error("User Not auth");
    const uf = await UserService.unfollowUser(From , To);
    return uf ; 
 }
}


const Extraresolver = {
  User: {
    tweets: (parent: User) => {
      return prisma.tweet.findMany({ where: { authorId: parent.id } });
    },
    createdAt: (parent: User) => parent.createdAt.toISOString(),
    updatedAt: (parent: User) => parent.updatedAt.toISOString(),
    followers: async (parent: User) => {
      const follows = await prisma.follows.findMany({
        where: { followingId: parent.id }
      });
      const followerPromises = follows.map((follow) =>
        prisma.user.findUnique({ where: { id: follow.followerId } })
      );
      return Promise.all(followerPromises);
    },
    following: async (parent: User) => {
      const follows = await prisma.follows.findMany({
        where: { followerId: parent.id }
      });
      const followingPromises = follows.map((follow) =>
        prisma.user.findUnique({ where: { id: follow.followingId } })
      );
      return Promise.all(followingPromises);
    },
  },
}

export { Extraresolver };


export const resolvers = { Query, Extraresolver, Mutation };
