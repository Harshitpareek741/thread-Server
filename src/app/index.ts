import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import User from '../User';
import { jwtTokenService} from '../services/service';
import { GraphQlserver } from '../type/type';
import { Tweet } from '../Tweet';

const typeDefs = `
  ${User.type}
  ${Tweet.type}
  type Query {
   ${User.typeQuery}
   ${Tweet.typeQuery}
  }
  type Mutation {
   ${Tweet.typeMutation}
  }
`;

const resolvers = {
    Query : {
      ...User.resolvers.Query,
      ...Tweet.resolvers.Query
    },
    Mutation: {
      ...Tweet.resolvers.Mutation,
    },
    ...Tweet.resolvers.Extraresolver,
    ...User.resolvers.Extraresolver
};

async function initStart(): Promise<express.Express> {
  const app = express();

  const server = new ApolloServer<GraphQlserver>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', cors(), express.json(), expressMiddleware(server , {
    context: async ({req,res}) => {
      return {
        user : req.headers.authorization ? await jwtTokenService((req.headers.authorization).split("Bearer ")[1]) : undefined
      }
    }
  }));

  return app;
}

export default initStart;
