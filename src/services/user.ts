import axios from "axios";
import prisma from "../clientdb";
import { createJWTToken } from "./service";
import { PrismaClient } from "@prisma/client";

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

  interface payload { 
    id : string ; 
    firstName : string ; 
    lastName : string ;
    bio : string ; 
    location : string ; 
    website : string ; 
  }

class User {
    public static async createUserFromToken(token : string){
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
    }
    public static async updateUser(payload : payload){
        const {id , firstName , lastName , bio , website , location} = payload;  
      const Userdata = await prisma.user.update({
        where : {id : id},
        data : {
           firstName : firstName,
           lastName : lastName,
        }
      });
      return Userdata;
    }
    public static async followUser(From : string , To : string){
      await prisma.follows.create({
         data : {
          follower : {connect : {id : From}},
          following : {connect : {id : To}}
         },
       });
       return true;
    }
    public static async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
      try {
        const result = await prisma.follows.delete({
          where: {
            followerId_followingId: {
              followerId: followerId,
              followingId: followingId
            }
          }
        });
    
        // If the result is found and deleted, return true
        return result ? true : false;
      } catch (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }
    }
    
    
    
} 

export default User;