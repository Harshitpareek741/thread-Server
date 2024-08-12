const type = `#graphql
type User {
 id : String!
 firstName : String!
 lastName : String!
 email : String!
 profilePhotoUrl : String
 tweets : [Tweet!]!
}`

export default type;