const typemutation = `
 #graphql
 updateUser(payload : payload) : User!
 followUser(From : String , To : String) : Boolean!
 unfollowUser(From : String , To : String) : Boolean!
`;

export default typemutation;