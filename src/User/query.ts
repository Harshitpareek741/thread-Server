const typeQuery = `
 #graphql
   GoogleAuthentication(token : String ) : String
   GetUserFromContext : User
   GetUserFromId(id : String!): User
`;
export default typeQuery;