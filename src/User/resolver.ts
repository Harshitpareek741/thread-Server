import axios from 'axios'
import prisma from '../clientdb';
import {createJWTToken} from '../services/service';

interface GoogleTokenResponse {
    iss: string; // Issuer
    azp: string; // Authorized party
    aud: string; // Audience
    sub: string; // Subject
    email: string; // Email
    email_verified: string; // Email verified (should be boolean, but it's a string in your data)
    nbf: string; // Not before
    name: string; // Full name
    picture: string; // Profile picture URL
    given_name: string; // Given name
    family_name: string; // Family name
    iat: string; // Issued at
    exp: string; // Expiration time
    jti: string; // JWT ID
    alg: string; // Algorithm
    kid: string; // Key ID
    typ: string; // Type
  }
import { GraphQlserver } from '../type/type';
import { Console, log } from 'console';
import { User } from '@prisma/client';


  const  Query = {
        GoogleAuthentication: async (parent: any, args: { token: string }) => {
          const {token} = args;
          const {data} = await axios.get<GoogleTokenResponse>(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
          const user = await prisma.user.findUnique({where: {email: data.email}});
    
          if(!user){
             await prisma.user.create({
                data: {
                    firstName : data.given_name,
                    lastName : data.family_name,
                    email : data.email,
                    profilePhotoUrl : data.picture
                },
             });
          }
          
          const acuser = await prisma.user.findUnique({where:{email : data.email}});
          if(!acuser){throw new  Error("user not made");}
          const newtoken =  createJWTToken(acuser);
           
          return newtoken;  
        },
        GetUserFromContext: async (parent: any , args : any , ctx: GraphQlserver) => {
            const ids = ctx.user?.id ; 
            const datas  = await prisma.user.findUnique({where : {id : ids}});
            return datas;
        }

    };
    
    
    

const Extraresolver = {
    User: {
     tweets: (parent : User) => {
         return prisma.tweet.findMany({where : {authorId : parent.id}});
     },
    },
 }

export const resolvers =  {Query,Extraresolver};
