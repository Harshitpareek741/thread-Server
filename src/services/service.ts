import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { jwtToken } from '../type/type';
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET || "";

function createJWTToken(user: User) {
  if (!user) {
    throw new Error('User is required');
  }

  const payload : jwtToken = {
    id: user.id,
    email: user.email,
  };

  // Using HS256 algorithm with a simple secret
  const token = jwt.sign(payload, JWT_SECRET);
  return token ;
}

function jwtTokenService(token : string){
  try{
  return jwt.verify(token, JWT_SECRET) as jwtToken;
  }
  catch(error){
    return null;
  }
}
export  {createJWTToken,jwtTokenService};
