import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { jwtToken } from '../type/type';
const SECRET = 'harSHI132';

function createJWTToken(user: User) {
  if (!user) {
    throw new Error('User is required');
  }

  const payload : jwtToken = {
    id: user.id,
    email: user.email,
  };

  // Using HS256 algorithm with a simple secret
  const token = jwt.sign(payload, SECRET);
  return token ;
}

function jwtTokenService(token : string){
  try{
  return jwt.verify(token, SECRET) as jwtToken;
  }
  catch(error){
    return null;
  }
}
export  {createJWTToken,jwtTokenService};
