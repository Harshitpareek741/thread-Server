const type = `#graphql
input payload{ 
 id : String!,
 firstName : String! ,  
 lastName : String! ,
 bio : String,
 website : String!
 location : String
}
type User {
 id : String!
 firstName : String!
 lastName : String
 email : String!
 profilePhotoUrl : String
 tweets : [Tweet!]!
 createdAt: String!  
 updatedAt: String!
 followers : [User]!
 following : [User]!
}`

export default type;
