const typeQuery = `
 #graphql
   GoogleAuthentication(token : String ) : String
   GetUserFromContext : User
   GetUserFromId(id : String!): User
   GetAllUsers : [User]
`;
export default typeQuery;